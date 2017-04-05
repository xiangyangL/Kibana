import _ from 'lodash';
import chrome from 'ui/chrome/chrome';
import breadCrumbsTemplate from 'ui/partials/bread_crumbs.html';
import uiModules from 'ui/modules';
let module = uiModules.get('kibana');

module.directive('breadCrumbs', function () {
  return {
    restrict: 'E',
    scope: {
      omitCurrentPage: '='
    },
    template: breadCrumbsTemplate,
    controller: function ($scope) {
      // Capitalize the first letter of each bread crumb.
      //原先代码将面包屑每个单词首字母大写，汉化后该方法处理将返回空数组，因此作注销处理
      // $scope.breadcrumbs = chrome.getBreadcrumbs().map(breadcrumb => _.startCase(breadcrumb));
      $scope.breadcrumbs = chrome.getBreadcrumbs();
      //造成面包屑数组每次删除一个
      //暂未弄清该功能的作用
      // if ($scope.omitCurrentPage === true) {
      //   $scope.breadcrumbs.pop();
      // }
    }
  };
});
