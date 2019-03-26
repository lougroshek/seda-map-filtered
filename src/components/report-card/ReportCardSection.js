import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import DynamicScatterplot from './DynamicScatterplot';

export class ReportCardSection extends Component {
  static propTypes = {
    controls: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({ 
            id: PropTypes.string, 
            label: PropTypes.string 
          })
        )
      })
    ),
    region: PropTypes.string,
    xVar: PropTypes.string,
    yVar: PropTypes.string,
    zVar: PropTypes.string,
    highlight: PropTypes.string,
    selected: PropTypes.array,
    selectedColors: PropTypes.array,
    data: PropTypes.object,
    onOptionChange: PropTypes.func,
    classes: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    /**
     * Determines the graph config variant
     */
    variant: PropTypes.string,
  }

  render() {
    const { title, description, ...rest } = this.props;
    return (
      <div className="report-card-section">
        <Typography classes={{root: "report-card-section__heading" }}>
          {title}
        </Typography>
        <div className="report-card-section__body">
          <Typography variant="body2">
            {description}
          </Typography>
          <DynamicScatterplot
            {...rest}
          />
        </div>
      </div>
    )
  }
}

export default ReportCardSection
