import columnDefs from './ag-grid-col.js'
import rowData from './ag-grid-row.js'
import { getContextMenuItems,onCellValueChanged } from './ag-grid-api.js'

const option = {
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
        flex:1,
        maxWidth:100,
        lockPinned: true,
        suppressMovable: true,
        cellClass: 'suppress-movable-col',
        // editable: true,
      },
      enableRangeSelection: true,  // 开启范围选择
      // debug: true,
      columnDefs,
      rowData,
      suppressDragLeaveHidesColumns: true,
      getContextMenuItems: params => getContextMenuItems(params, option),
      onCellValueChanged: params => onCellValueChanged(params, option),
}

export default option