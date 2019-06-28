import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import { getChoroplethColors, getMetricRange } from '../../modules/config';
import { getValuePositionForMetric } from '../../modules/config';
import LegendBar from '../molecules/LegendBar';
import { getLang } from '../../constants/lang';
import { getFeatureProperty } from '../../modules/features';
import SedaScatterplotPreview from './SedaScatterplotPreview';
import SedaLocationMarkers from './SedaLocationMarkers';
import { Button } from '@material-ui/core';

const choroplethColors = getChoroplethColors();

const getValuePositionForVarName = (feature, varName, region) => {
  if(!feature || !feature.properties) { return null; }
  const value = getFeatureProperty(feature, varName)
  return getValuePositionForMetric(value, varName, region)
}

const LegendPanel = ({
  title,
  expanded,
  children,
  className,
  ...rest
}) => {
  return (
    <div className={classNames("legend-panel", className)} {...rest}>
      <div className="legend-panel__title">
        {title}
      </div>
      { expanded && 
        <div className="legend-panel__content">
          {children}
        </div> 
      }
    </div>
  )
}

LegendPanel.propTypes = {
  title: PropTypes.string,
  expanded: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node, PropTypes.string
  ]),
  className: PropTypes.string,
}

const SedaMapLegend = ({
  metric,
  demographic,
  region,
  secondary,
  hovered,
  variant,
  onFullClick,
  onToggleClick,
  onHelpClick,
}) => {
  const primaryValue = 
    Math.round(getFeatureProperty(hovered, `${demographic}_${metric}`)*100)/100
  const secondaryValue = 
    Math.round(getFeatureProperty(hovered, `${demographic}_${secondary}`)*100)/100
  const primaryPosition = getValuePositionForVarName(
    hovered, `${demographic}_${metric}`, region
  )
  const secondaryPosition = getValuePositionForVarName(
    hovered, `${demographic}_${secondary}`, region
  )
  return (
    <div className={classNames("map-legend", {
      "map-legend--secondary": secondaryPosition || secondaryPosition === 0
    })}>
      { variant === 'chart' &&
        <LegendPanel
          title={getLang(`label_${metric}`) + ' vs. ' + getLang(`label_${secondary}`)}
          expanded={true}
          className="legend-panel--chart"
        >
          <SedaScatterplotPreview>
            <SedaLocationMarkers />
            <LegendBar
              vertical={true}
              value={getLang('LABEL_SHORT_'+metric) + ' ' + primaryValue}
              colors={choroplethColors} 
              startLabel={getLang('LEGEND_LOW')}
              endLabel={getLang('LEGEND_HIGH')}
              colorRange={getMetricRange(metric, demographic, region, 'map')}
              legendRange={getMetricRange(metric, demographic, region)}
              markerPosition={primaryPosition}
              className="legend-bar--y-preview"
            />
            <LegendBar
            value={getLang('LABEL_SHORT_'+secondary) + ' ' + secondaryValue}
            colors={['#ccc', '#ccc']} 
            startLabel={getLang('LEGEND_LOW_'+secondary)}
            endLabel={getLang('LEGEND_HIGH_'+secondary)}
            legendRange={getMetricRange(secondary, demographic, region)}
            markerPosition={secondaryPosition}
            className="legend-bar--x-preview"
          />
          </SedaScatterplotPreview>
        </LegendPanel>
      }
      { variant === 'condensed' &&
        <LegendPanel
          title={getLang('LABEL_'+metric)}
          expanded={true}
          className="legend-panel--condensed"
        >
          <LegendBar
            colors={choroplethColors} 
            value={primaryValue}
            startLabel={getLang('LEGEND_LOW_'+metric)}
            endLabel={getLang('LEGEND_HIGH_'+metric)}
            colorRange={getMetricRange(metric, demographic, region, 'map')}
            legendRange={getMetricRange(metric, demographic, region, 'map')}
            markerPosition={primaryPosition}
          />
          <LegendBar 
            className="legend-bar--secondary"
            value={secondaryValue}
            title={getLang('LABEL_'+secondary)}
            colors={['#fff', '#fff']} 
            startLabel={getLang('LEGEND_LOW_'+secondary)}
            endLabel={getLang('LEGEND_HIGH_'+secondary)}
            colorRange={getMetricRange(secondary, demographic, region, 'map')}
            legendRange={getMetricRange(secondary, demographic, region, 'map')}
            markerPosition={secondaryPosition}
          />
        </LegendPanel>
      }
      
      <div className="legend-actions">
        <Button variant="contained" color="primary" onClick={onToggleClick}>
          { variant === 'chart' ? 'Hide Chart' : 'Show Chart' }
        </Button>
        {
          variant === 'chart' &&
            <Button variant="contained" color="primary" onClick={onFullClick}>
              Show Full Chart
            </Button>
        }
        <Button variant="contained" color="secondary" onClick={onHelpClick}>
          Help
        </Button>
      </div>
    </div>
  )
}

SedaMapLegend.propTypes = {
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  secondary: PropTypes.string,
  hovered: PropTypes.object,
  onFullClick: PropTypes.func,
  onToggleClick: PropTypes.func,
  onHelpClick: PropTypes.func,
}

export default SedaMapLegend
