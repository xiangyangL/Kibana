import VislibVisTypeVislibVisTypeProvider from 'ui/vislib_vis_type/vislib_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import areaTemplate from 'plugins/kbn_vislib_vis_types/editors/area.html';

export default function HistogramVisType(Private) {
  const VislibVisType = Private(VislibVisTypeVislibVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);

  return new VislibVisType({
    name: 'area',
    title: '区域图',
    icon: 'fa-area-chart',
    description: '制作折线区域图，用来对比两个或多个参数， ' +
      '从而评估不相关的数据点的相对变化， ' +
      '根据面积的重叠，可以很直观的展示参数之间的变化关系。' ,
    params: {
      defaults: {
        shareYAxis: true,
        addTooltip: true,
        addLegend: true,
        legendPosition: 'right',
        smoothLines: false,
        scale: 'linear',
        interpolate: 'linear',
        mode: 'stacked',
        times: [],
        addTimeMarker: false,
        defaultYExtents: false,
        setYExtents: false,
        yAxis: {}
      },
      legendPositions: [{
        value: 'left',
        text: '左侧',
      }, {
        value: 'right',
        text: '右侧',
      }, {
        value: 'top',
        text: '顶部',
      }, {
        value: 'bottom',
        text: '底部',
      }],
      scales: ['linear', 'log', 'square root'],
      modes: ['stacked', 'overlap', 'percentage', 'wiggle', 'silhouette'],
      editor: areaTemplate
    },
    implementsRenderComplete: true,
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Y轴',
        min: 1,
        aggFilter: '!std_dev',
        defaults: [
          { schema: 'metric', type: 'count' }
        ]
      },
      {
        group: 'buckets',
        name: 'segment',
        title: 'X轴',
        min: 0,
        max: 1,
        aggFilter: '!geohash_grid'
      },
      {
        group: 'buckets',
        name: 'group',
        title: '划分区域',
        min: 0,
        max: 1,
        aggFilter: '!geohash_grid'
      },
      {
        group: 'buckets',
        name: 'split',
        title: '划分图表',
        min: 0,
        max: 1,
        aggFilter: '!geohash_grid'
      }
    ])
  });
};
