import columnDefs from './ag-grid-col.js'
import rowData from './ag-grid-row.js'
import {onCellValueChanged, getContextMenuItems, onGridReady} from './ag-grid-api.js'

const option = {
      defaultColDef: {
        // sortable: true,
        resizable: true,
        filter: true,
        flex:1,
        maxWidth:100,
        lockPinned: true,
        suppressMovable: true,
        cellClass: 'suppress-movable-col',
        menuTabs:[],
        // editable: true,
      },
      enableRangeSelection: true,  // 开启范围选择
      // debug: true,
      columnDefs,
      rowData,
      suppressDragLeaveHidesColumns: true,
      getContextMenuItems: params => getContextMenuItems(params, option),
      onCellValueChanged: params => onCellValueChanged(params, option),
      onGridReady: params => onGridReady(params, option),
}

export default option