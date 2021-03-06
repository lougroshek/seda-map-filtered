
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { ScatterplotPreview } from '../organisms/Scatterplot';
import { getScatterplotVars } from '../../modules/config'

const mapStateToProps = ({
  scatterplot: { data, error }
}, {
  match: { params: { region, highlightedState, metric, demographic, secondary }}
}) => ({
  ...getScatterplotVars(region, metric, demographic),
  data,
  region,
  error,
  highlightedState,
})

export default compose(
  withRouter,
  connect(mapStateToProps, null)
)(ScatterplotPreview)
