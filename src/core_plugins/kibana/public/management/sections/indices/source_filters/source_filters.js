import { find, each, escape, invoke, size, without } from 'lodash';

import uiModules from 'ui/modules';
import Notifier from 'ui/notify/notifier';
import FieldWildcardProvider from 'ui/field_wildcard';

import controlsHtml from 'plugins/kibana/management/sections/indices/source_filters/controls.html';
import filterHtml from 'plugins/kibana/management/sections/indices/source_filters/filter.html';
import template from './source_filters.html';
import './source_filters.less';

const notify = new Notifier();

uiModules.get('kibana')
.directive('sourceFilters', function (Private, $filter) {
  const angularFilter = $filter('filter');
  const { fieldWildcardMatcher } = Private(FieldWildcardProvider);
  const rowScopes = []; // track row scopes, so they can be destroyed as needed

  return {
    restrict: 'E',
    scope: {
      indexPattern: '='
    },
    template,
    controllerAs: 'sourceFilters',
    controller: class FieldFiltersController {
      constructor($scope) {
        if (!$scope.indexPattern) {
          throw new Error('index pattern is required');
        }

        $scope.perPage = 25;
        $scope.columns = [
          {
            title: '过滤'
          },
          {
            title: '匹配项',
            sortable: false,
            info: '与过滤器匹配的源字段。'
          },
          {
            title: '操作',
            sortable: false
          }
        ];

        this.$scope = $scope;
        this.saving = false;
        this.editing = null;
        this.newValue = null;
        //this.placeHolder = 'source filter, accepts wildcards (e.g., `user*` to filter fields starting with \'user\')';
        this.placeHolder = '源过滤器，接受通配符(例如，`user *`用于过滤以\'user\'开头的字段)';
        $scope.$watchMulti([ '[]indexPattern.sourceFilters', '$parent.fieldFilter' ], () => {
          invoke(rowScopes, '$destroy');
          rowScopes.length = 0;

          if ($scope.indexPattern.sourceFilters) {
            $scope.rows = [];
            each($scope.indexPattern.sourceFilters, (filter) => {
              const matcher = fieldWildcardMatcher([ filter.value ]);
              // compute which fields match a filter
              const matches = $scope.indexPattern.getNonScriptedFields().map(f => f.name).filter(matcher).sort();
              if ($scope.$parent.fieldFilter && !angularFilter(matches, $scope.$parent.fieldFilter).length) {
                return;
              }
              // compute the rows
              const rowScope = $scope.$new();
              rowScope.filter = filter;
              rowScopes.push(rowScope);
              $scope.rows.push([
                {
                  markup: filterHtml,
                  scope: rowScope
                },
                size(matches) ? escape(matches.join(', ')) : '<em>源过滤器未匹配到任何字段。</em>',
                {
                  markup: controlsHtml,
                  scope: rowScope
                }
              ]);
            });
            // Update the tab count
            find($scope.$parent.editSections, {index: 'sourceFilters'}).count = $scope.rows.length;
          }
        });
      }

      all() {
        return this.$scope.indexPattern.sourceFilters || [];
      }

      delete(filter) {
        if (this.editing === filter) {
          this.editing = null;
        }

        this.$scope.indexPattern.sourceFilters = without(this.all(), filter);
        return this.save();
      }

      create() {
        const value = this.newValue;
        this.newValue = null;
        this.$scope.indexPattern.sourceFilters = [...this.all(), { value }];
        return this.save();
      }

      save() {
        this.saving = true;
        this.$scope.indexPattern.save()
        .then(() => this.editing = null)
        .catch(notify.error)
        .finally(() => this.saving = false);
      }
    }
  };
});
