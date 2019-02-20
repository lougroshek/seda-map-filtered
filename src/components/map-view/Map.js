import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defaultMapStyle, getChoroplethLayer, getChoroplethOutline, getDotLayer, getBackgroundChoroplethLayer } from '../../style/map-style';
import { onHoverFeature, onViewportChange, onSelectFeature, onCoordsChange } from '../../actions/mapActions';
import { getChoroplethProperty } from '../../modules/map';
import mapboxgl from 'mapbox-gl';
import { getStops } from '../../modules/metrics';
import { isPropEqual } from '../../utils';

class Map extends Component {

  state = {
    mapStyle: defaultMapStyle
  };

  _getContainerSize() {
    if (!this.mapContainer) {
      return { width: 400, height: 400 }
    }
    return {
      width: this.mapContainer.clientWidth,
      height: this.mapContainer.clientHeight
    }
  }

  _handleResize() {
    this._updateDimensions();
  }

  _updateDimensions(dimensions = this._getContainerSize()) {
    this.props.onViewportChange(dimensions);
  }

  _setFeatureState(region, featureId, state) {
    this.map && this.map.setFeatureState({
      source: 'composite', 
      sourceLayer: region, 
      id: featureId
    }, state);
  }

  _updateOutlineHighlight(oldFeature, newFeature, region) {
    const featureId = newFeature ? newFeature.id : null;
    if (oldFeature && oldFeature.id) {
      this._setFeatureState(
        region, oldFeature.id, { hover: false}
      );
    }
    if (featureId) {
      this._setFeatureState(
        region, featureId, { hover: true}
      );
    }
  }

  _updateChoropleth(init = false) {
    const { region, dataProp, stops } = this.props;
    let updatedLayers;
    if (region !== 'schools') {
      const choroplethLayer = 
        getChoroplethLayer(region, dataProp, stops);
      const choroplethOutline = 
        getChoroplethOutline(region);
      updatedLayers = 
        defaultMapStyle
          .get('layers')
          .splice(4, (init ? 0 : 2), choroplethLayer, choroplethOutline)
    } else {
      const choroplethLayer = getBackgroundChoroplethLayer('districts', dataProp, stops);
      const dotLayer = getDotLayer(region, dataProp, stops);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(4, (init ? 0 : 2), choroplethLayer)
        .splice(100, (init ? 0 : 1), dotLayer)
    }

    const mapStyle = defaultMapStyle
      .set('layers', updatedLayers);
    this.setState({ mapStyle });
  }

  _onLoad = event => {
    this.map = event.target;
    this.map.addControl(new mapboxgl.AttributionControl(), 'top-right');
  }

  _getUniqueFeatures(array, comparatorProperty) {
    const existingFeatureKeys = {};
    return array.filter(function(el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });
  }

  _onClick = event => {
    const { features } = event;
    const selectedFeature = features && 
      features.find(f => f.layer.id === 'choropleth');
    return selectedFeature &&
      this.props.onSelectFeature(selectedFeature)
  }

  _onHover = event => {
    const { features, srcEvent: { offsetX, offsetY } } = event;
    const { region } = this.props;
    const hoveredFeature = features && 
      features.find(f => (
        (region !== 'schools' && f.layer.id === 'choropleth') ||
        (region === 'schools' && f.layer.id === 'dots')
      ));
    const coords = { x: offsetX, y: offsetY };
    console.log(hoveredFeature);
    this.props.onHoverFeature(hoveredFeature, coords);
  };

  componentDidMount() {
    window.addEventListener(
      'resize', this._handleResize.bind(this)
    );
    this._updateDimensions();
    this._updateChoropleth(true);
  }


  componentDidUpdate(prevProps) {
    const { metric, region, demographic, hoveredFeature } = this.props;
    const oldFeature = prevProps.hoveredFeature;
    if (
      prevProps.metric !== metric ||
      prevProps.region !== region ||
      prevProps.demographic !== demographic
    ) {
      this._updateChoropleth();
    }
    if (
      !isPropEqual(oldFeature, hoveredFeature, 'id')
    ) {
      this._updateOutlineHighlight(
        oldFeature, 
        hoveredFeature, 
        region
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize', this._handleResize.bind(this)
    );
  }

  render() {
    const { mapStyle } = this.state;
    const { viewport, onViewportChange } = this.props;
    return (
      <div 
        className="map"
        ref={ (el) => this.mapContainer = el }
      >
        <div className="map__container">
          <ReactMapGL
            { ...viewport }
            mapStyle={mapStyle}
            onViewportChange={ (vp) => onViewportChange(vp) }
            onHover={this._onHover}
            onClick={this._onClick}
            onLoad={this._onLoad}
            attributionControl={false}
          />
        </div>
      </div>
    );
  }
}

Map.propTypes = {
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  viewport: PropTypes.object,
  onViewportChange: PropTypes.func,
  onHoverFeature: PropTypes.func,
  onSelectFeature: PropTypes.func,
}

const mapStateToProps = ({ 
  map: { options, viewport },
  hovered: { feature },
  metrics 
}) => ({
  ...options,
  viewport,
  dataProp: getChoroplethProperty(options),
  stops: getStops(metrics, options.metric),
  hoveredFeature: feature,
  metricItem: metrics.items && options && metrics.items[options.metric] ?
    metrics.items[options.metric] : {}
});

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature, coords) => (
    dispatch(onHoverFeature(feature)) &&
    dispatch(onCoordsChange(coords))
  ),
  onViewportChange: (vp) => dispatch(onViewportChange(vp)),
  onSelectFeature: (feature) => dispatch(onSelectFeature(feature)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
