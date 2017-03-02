import _ from 'lodash';
import supports from 'ui/utils/supports';
import VislibVisTypeVislibVisTypeProvider from 'ui/vislib_vis_type/vislib_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import AggResponseGeoJsonGeoJsonProvider from 'ui/agg_response/geo_json/geo_json';
import FilterBarPushFilterProvider from 'ui/filter_bar/push_filter';
import tileMapTemplate from 'plugins/kbn_vislib_vis_types/editors/tile_map.html';

export default function TileMapVisType(Private, getAppState, courier, config) {
  const VislibVisType = Private(VislibVisTypeVislibVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);
  const geoJsonConverter = Private(AggResponseGeoJsonGeoJsonProvider);

  return new VislibVisType({
    name: 'tile_map',
    title: '地图',
    icon: 'fa-map-marker',
    description: '在地理地图上显示你数据的分布情况。需要一个经纬字段。更加具体的来讲，一种映射类型的字段，包含坐标的经度和纬度。',
    params: {
      defaults: {
        mapType: 'Scaled Circle Markers',
        isDesaturated: true,
        addTooltip: true,
        heatMaxZoom: 16,
        heatMinOpacity: 0.1,
        heatRadius: 25,
        heatBlur: 15,
        heatNormalizeData: true,
        legendPosition: 'bottomright',
        mapZoom: 2,
        mapCenter: [15, 5],
        wms: config.get('visualization:tileMap:WMSdefaults')
      },
      legendPositions: [{
        value: 'bottomleft',
        text: '左下',
      }, {
        value: 'bottomright',
        text: '右下',
      }, {
        value: 'topleft',
        text: '左上',
      }, {
        value: 'topright',
        text: '右上',
      }],
      mapTypes: ['Scaled Circle Markers', 'Shaded Circle Markers', 'Shaded Geohash Grid', 'Heatmap'],
      canDesaturate: !!supports.cssFilters,
      editor: tileMapTemplate
    },
    listeners: {
      rectangle: function (event) {
        const agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;

        const pushFilter = Private(FilterBarPushFilterProvider)(getAppState());
        const indexPatternName = agg.vis.indexPattern.id;
        const field = agg.fieldName();
        const filter = {geo_bounding_box: {}};
        filter.geo_bounding_box[field] = event.bounds;

        pushFilter(filter, false, indexPatternName);
      },
      mapMoveEnd: function (event) {
        const vis = _.get(event, 'chart.geohashGridAgg.vis');
        if (vis && vis.hasUiState()) {
          vis.getUiState().set('mapCenter', event.center);
        }
      },
      mapZoomEnd: function (event) {
        const vis = _.get(event, 'chart.geohashGridAgg.vis');
        if (vis && vis.hasUiState()) {
          vis.getUiState().set('mapZoom', event.zoom);
        }

        const autoPrecision = _.get(event, 'chart.geohashGridAgg.params.autoPrecision');
        if (autoPrecision) {
          courier.fetch();
        }
      }
    },
    responseConverter: geoJsonConverter,
    implementsRenderComplete: true,
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: '值',
        min: 1,
        max: 1,
        aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality'],
        defaults: [
          { schema: 'metric', type: 'count' }
        ]
      },
      {
        group: 'buckets',
        name: 'segment',
        title: '地理坐标',
        aggFilter: 'geohash_grid',
        min: 1,
        max: 1
      },
      {
        group: 'buckets',
        name: 'split',
        title: '分图',
        deprecate: true,
        deprecateMessage: '地图分割图功能已过时。',
        min: 0,
        max: 1
      }
    ])
  });
};
