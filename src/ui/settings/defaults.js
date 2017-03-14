import moment from 'moment-timezone';

export default function defaultSettingsProvider() {
  const weekdays = moment.weekdays().slice();
  const [defaultWeekday] = weekdays;

  // wrapped in provider so that a new instance is given to each app/test
  return {
    'buildNum': {
      readonly: true
    },
    'query:queryString:options': {
      value: '{ "analyze_wildcard": true }',
      description: 'Lucene查询字符串解析器的<a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html" target="_blank">Options</a>',
      type: 'json'
    },
    'sort:options': {
      value: '{ "unmapped_type": "boolean" }',
      description: 'Elasticsearch排序参数的<a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-sort.html" target="_blank">选项</a>',
      type: 'json'
    },
    'dateFormat': {
      value: 'MMMM Do YYYY, HH:mm:ss.SSS',
      description: '当显示规整格式的日期时,请使用此 <a href="http://momentjs.com/docs/#/displaying/format/" target="_blank">格式</a>',
    },
    'dateFormat:tz': {
      value: 'Browser',
      description: '应该使用哪个时区  "Browser" 会使用你的浏览器探测到的时区.',
      type: 'select',
      options: ['Browser', ...moment.tz.names()]
    },
    'dateFormat:scaled': {
      type: 'json',
      value:
`[
  ["", "HH:mm:ss.SSS"],
  ["PT1S", "HH:mm:ss"],
  ["PT1M", "HH:mm"],
  ["PT1H", "YYYY-MM-DD HH:mm"],
  ["P1DT", "YYYY-MM-DD"],
  ["P1YT", "YYYY"]
]`,
      description: (
            '应用在时基数据场景中定义的格式化数值,应该按照顺序呈现,格式化的时间戳应该适应测量的间隔.键值是' +
            ' <a href="http://en.wikipedia.org/wiki/ISO_8601#Time_intervals" target="_blank">' +
            'ISO8601 间隔.</a>'
      )
    },
    'dateFormat:dow': {
      value: defaultWeekday,
      description: '每周从周几开始?',
      type: 'select',
      options: weekdays
    },
    'defaultIndex': {
      value: null,
      description: '如果没有设置索引,就访问默认索引',
    },
    'defaultColumns': {
      value: ['_source'],
      description: '在发现栏中显示的默认列',
    },
    'metaFields': {
      value: ['_source', '_id', '_type', '_index', '_score'],
      description: '存在于_source之外的字段在显示时合并到我们的文档中',
    },
    'discover:sampleSize': {
      value: 500,
      description: '表格中显示的行数',
    },
    'doc_table:highlight': {
      value: true,
      description: '当文档数量较大时,高亮显示会导致在发现和保存搜索面板的页面请求变变慢',
    },
    'courier:maxSegmentCount': {
      value: 30,
      description: '发现中的请求被分成段，以防止大量请求发送到elasticsearch。 此设置会尝试防止段列表过长，这可能会导致请求处理时间过长'
    },
    'courier:ignoreFilterIfFieldNotInIndex': {
      value: false,
      description: '此配置增强了对包含访问不同索引的可视化的仪表板的支持。 设置为false时，所有过滤器都应用于所有可视化。 设置为true时，当可视化对象的索引不包含过滤字段时，将忽略可视化对象的过滤器.'
    },
    'fields:popularLimit': {
      value: 10,
      description: '前N个最受欢迎的字段要显示',
    },
    'histogram:barTarget': {
      value: 50,
      description: '在日期直方图中使用“自动”间隔时，尝试生成此许多条',
    },
    'histogram:maxBars': {
      value: 100,
      description: '在日期直方图中不显示多个条形，如果需要，可以缩放比例值',
    },
    'visualization:tileMap:maxPrecision': {
      value: 7,
      description: '在地图上显示的最大geoHash精度：7是高，10是非常高，12是最大.' +
      '<a href="http://www.elastic.co/guide/en/elasticsearch/reference/current/' +
      'search-aggregations-bucket-geohashgrid-aggregation.html#_cell_dimensions_at_the_equator" target="_blank">' +
      '单元尺寸说明</a>',
    },
    'visualization:tileMap:WMSdefaults': {
      value: JSON.stringify({
        enabled: false,
        url: 'https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer',
        options: {
          version: '1.3.0',
          layers: '0',
          format: 'image/png',
          transparent: true,
          attribution: 'Maps provided by USGS',
          styles: '',
        }
      }, null, 2),
      type: 'json',
      description: '瓦片图中WMS地图服务器支持的默认 <a href="http://leafletjs.com/reference.html#tilelayer-wms" target="_blank">属性</a>'
    },
    'visualization:colorMapping': {
      type: 'json',
      value: JSON.stringify({
        Count: '#6eadc1'
      }),
      description: '将值映射到可视化内的指定颜色'
    },
    'visualization:loadingDelay': {
      value: '2s',
      description: '在查询期间调暗可视化之前等待的时间'
    },
    'visualization:dimmingOpacity': {
      type: 'number',
      value: 0.5,
      description: '突出显示图表的其他元素时，图表项目的不透明度变暗。 该数字越低，突出显示的元素就越突出。这必须是介于0和1之间的数字.'
    },
    'csv:separator': {
      value: ',',
      description: '使用此字符串分隔导出的值',
    },
    'csv:quoteValues': {
      value: true,
      description: '应该在csv导出中引用值吗?',
    },
    'history:limit': {
      value: 10,
      description: '在有历史记录的字段（例如，查询输入）中，显示此许多最近的值',
    },
    'shortDots:enable': {
      value: false,
      description: '缩短长字段,例如,用f.b.baz替代foo.bar.baz',
    },
    'truncate:maxHeight': {
      value: 115,
      description: '表格中单元格应占用的最大高度。 设置为0以禁用截断'
    },
    'indexPattern:fieldMapping:lookBack': {
      value: 5,
      description: '对于在其名称中包含时间戳的索引模式，查找许多最近匹配模式，以从中查询出字段映射'
    },
    'format:defaultTypeMap': {
      type: 'json',
      value:
`{
  "ip": { "id": "ip", "params": {} },
  "date": { "id": "date", "params": {} },
  "number": { "id": "number", "params": {} },
  "boolean": { "id": "boolean", "params": {} },
  "_source": { "id": "_source", "params": {} },
  "_default_": { "id": "string", "params": {} }
}`,
      description: '默认为每个字段类型使用格式名称的映射.如果未明确提及字段类型，则使用“_default_”'
    },
    'format:number:defaultPattern': {
      type: 'string',
      value: '0,0.[000]',
      description: '“数字”格式的默认<a href="http://numeraljs.com/" target="_blank">数字格式</a>'
    },
    'format:bytes:defaultPattern': {
      type: 'string',
      value: '0,0.[000]b',
      description: '“字节”格式的默认<a href="http://numeraljs.com/" target="_blank">数字格式</a>'
    },
    'format:percent:defaultPattern': {
      type: 'string',
      value: '0,0.[000]%',
      description: '“百分比”格式的默认<a href="http://numeraljs.com/" target="_blank">数字格式</a>'
    },
    'format:currency:defaultPattern': {
      type: 'string',
      value: '($0,0.[00])',
      description: '“货币”格式的默认<a href="http://numeraljs.com/" target="_blank">数字格式</a>'
    },
    'savedObjects:perPage': {
      type: 'number',
      value: 5,
      description: '在加载对话框中每页显示的对象数'
    },
    'timepicker:timeDefaults': {
      type: 'json',
      value:
`{
  "from": "now-15m",
  "to": "now",
  "mode": "quick"
}`,
      description: '当Kibana没有启动时使用的时间过滤器选择.'
    },
    'timepicker:refreshIntervalDefaults': {
      type: 'json',
      value:
`{
  "display": "Off",
  "pause": false,
  "value": 0
}`,
      description: '时间过滤器的默认刷新间隔'
    },
    'dashboard:defaultDarkTheme': {
      value: false,
      description: '默认情况下，新仪表板使用深色主题'
    },
    'filters:pinnedByDefault': {
      value: false,
      description: '默认情况下，过滤器是否应该具有全局状态（被固定）'
    },
    'notifications:banner': {
      type: 'markdown',
      description: '用于向所有用户发送临时通知的自定义标题. <a href="https://help.github.com/articles/basic-writing-and-formatting-syntax/" target="_blank">支持Markdown</a>.',
      value: ''
    },
    'notifications:lifetime:banner': {
      value: 3000000,
      description: '屏幕上显示标题通知的时间（以毫秒为单位）。 设置为无限将禁用.'
    },
    'notifications:lifetime:error': {
      value: 300000,
      description: '屏幕上显示的错误通知的时间(以毫秒为单位)。 设置为无限将禁用.'
    },
    'notifications:lifetime:warning': {
      value: 10000,
      description: '屏幕上显示的告警通知的时间(以毫秒为单位)。 设置为无限将禁用'
    },
    'notifications:lifetime:info': {
      value: 5000,
      description: '屏幕上显示的info级别通知的时间(以毫秒为单位)。 设置为无限将禁用.'
    },
    // Timelion stuff
    'timelion:showTutorial': {
      value: false,
      description: 'Should I show the tutorial by default when entering the timelion app?'
    },
    'timelion:es.timefield': {
      value: '@timestamp',
      description: 'Default field containing a timestamp when using .es()'
    },
    'timelion:es.default_index': {
      value: '_all',
      description: 'Default elasticsearch index to search with .es()'
    },
    'timelion:target_buckets': {
      value: 200,
      description: 'The number of buckets to shoot for when using auto intervals'
    },
    'timelion:max_buckets': {
      value: 2000,
      description: 'The maximum number of buckets a single datasource can return'
    },
    'timelion:default_columns': {
      value: 2,
      description: 'Number of columns on a timelion sheet by default'
    },
    'timelion:default_rows': {
      value: 2,
      description: 'Number of rows on a timelion sheet by default'
    },
    'timelion:graphite.url': {
      value: 'https://www.hostedgraphite.com/UID/ACCESS_KEY/graphite',
      description: '<em>[experimental]</em> The URL of your graphite host'
    },
    'timelion:quandl.key': {
      value: 'someKeyHere',
      description: '<em>[experimental]</em> Your API key from www.quandl.com'
    },
    'state:storeInSessionStorage': {
      value: false,
      description: '网址有时可能会变得太大，某些浏览器无法处理。 为了防止这样的事情发生，我们正在测试在会话存储中存储URL的部分是否有帮助。 请让我们持续关注它的发展！'
    }
  };
};
