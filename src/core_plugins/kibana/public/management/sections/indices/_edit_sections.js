import _ from 'lodash';
export default function GetFieldTypes() {

  return function (indexPattern) {
    const fieldCount = _.countBy(indexPattern.fields, function (field) {
      return (field.scripted) ? 'scripted' : 'indexed';
    });

    _.defaults(fieldCount, {
      indexed: 0,
      scripted: 0,
      sourceFilters: 0
    });

    return [
      {
        title: '字段',
        index: 'indexedFields',
        count: fieldCount.indexed
      },
      {
        title: '脚本字段',
        index: 'scriptedFields',
        count: fieldCount.scripted
      },
      {
        title: '源码过滤器',
        index: 'sourceFilters',
        count: fieldCount.sourceFilters
      }
    ];
  };
};
