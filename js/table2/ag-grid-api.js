import dom from "./../customFrom.js"
import columnDefs,{showtype} from './ag-grid-col.js'
import { tileData } from './../public/api.js'
import data from "../../data/index.js"
const categoryStr = (str) => {
    let str1 = ""
    if(str == '绿豆汤'){
        str1='green'
    }else if(str == '商务餐'){
        str1 = 'business'
    }else if(str == '泡面'){
        str1 = 'instance'
    }else if (str == '打包'){
        str1 = 'kuai'
    }else if(str == '快餐'){
        str1 = "copies"
    }else{
        str1 = ""
    }
    return str1
}

const onCellValueChanged = (params, gridOptions) => {
    if(isNaN(params.newValue)){
        params.data[`${params.colDef.field}`] = params.oldValue
    }
    // document.querySelector('#updateTips').classList.remove('isHide')
    gridOptions.api.refreshCells({force:true})
}

const getContextMenuItems = (params, gridOptions) => {
    let {column:{colId}} = params
    const result = []
    if(!colId.includes('date') && !colId.includes('day') && !colId.includes('week')){
        result.push(
            {
                name:'新增餐',
                action: () => {
                        const addMeal2_name = document.querySelector('#addMeal2_name')
                        const arr = []
                        
                        dom({
                            parent:'#addMeal2',
                            cancel:['#addMeal2_cancel1','#addMeal2_cancel2'],
                            sure:'#addMeal2_sure',
                            deleteData:[],
                            sureFun:() => {
                                let cols = colId.split('-')
                                let arr = [
                                    {
                                        headerName:addMeal2_name.value,
                                        field: `${cols[0]}-${addMeal2_name.value}`,
                                        columnGroupShow: 'open',
                                        editable: true,
                                        minWidth: 50,
                                        cellRenderer: params => showtype(params.data, params.value)
                                        
                                    },
                                    {
                                        headerName:'单价',
                                        field: `${cols[0]}-${addMeal2_name.value}-price`,
                                        columnGroupShow: 'open',
                                        editable: true,
                                        minWidth: 50,
                                        cellRenderer: params => {
                                            if(params.value == undefined || params.value == ""){
                                                params.data[`${cols[0]}-${addMeal2_name.value}-price`] = 1
                                                return showtype(params.data, 1)
                                            }else{
                                                return showtype(params.data, params.value)
                                            }
                                        }
                                        
                                    }
                                ]
                                for (const colDef of columnDefs) {
                                    if(colDef.children != null && colDef.field == cols[0]){
                                        colDef['children'].splice(colDef['children'].length - 2, 0, ...arr)
                                        break
                                    }
                                }
                                gridOptions.api.setColumnDefs(columnDefs)
                                const groupNames = data.res_company.map(v => v.company_id + "")
                                groupNames.forEach(v => {
                                    gridOptions.columnApi.setColumnGroupOpened(v, true);
                                })
                            },
                            initial:() => {
                            },
                            confirmSuccess: () => {
                                const colIds = colId.split('-')
                                const value = addMeal2_name.value
                                const AllCategory = tileData(columnDefs).reduce((pre, v) => {
                                    const reg = new RegExp(`${colIds[0]}`)
                                    if(v.field.match(reg) != null){
                                        pre.add(v.field.split('-')[1])
                                    }
                                    return pre
                                }, new Set())
                                // console.log(AllCategory,value)
                                // console.log(a)
                                return [...AllCategory].every(v => v != value)
                            },
                        })
                }
            },
            // {
            //     name:'修改餐单价',
            //     action: () => {

            //     }
            // },
            {
                name:'显示现金列',
                action: () => {
                    let cols = colId.split('-')
                    gridOptions.columnApi.applyColumnState({
                        state: [
                            {
                                colId: `${cols[0]}-cash`,
                                hide:false,
                            }
                        ]
                    })
                }
            },
        )
        if(!colId.includes('amount') && !colId.includes('cash')){
            result.push({
                name: '删除餐',
                action: () => {
                    const colIds = colId.split('-')
                    for(let i = 0; i < 2; i++ ){
                        for (const colDef of columnDefs) {
                            if(colDef.children != undefined){
                                for (const c_key in colDef.children) {
                                    if(colDef.children[c_key].field.includes(`${colIds[0]}-${colIds[1]}`)){
                                        colDef.children.splice(c_key, 1)
                                        // delete colDef.children[c_key]
                                        // colDefChild.splice()
                                    }
                                }
                            }
                        }
                    }
                    
                    for (const rdKey in gridOptions.rowData) {
                        for (const keys of Object.keys(gridOptions.rowData[rdKey])) {
                            // console.log(gridOptions.rowData[rdKey][keys])
                            // const value = String(gridOptions.rowData[rdKey][keys])
                            if(keys.includes(`${colIds[0]}-${colIds[1]}`)){
                                delete gridOptions.rowData[rdKey][keys]
                            }
                        }
                    }
                    gridOptions.api.setColumnDefs(columnDefs)
                    gridOptions.api.refreshCells({force:true})

                    const groupNames = data.res_company.map(v => v.company_id + "")
                    groupNames.forEach(v => {
                        if(v == colIds[0]){
                            gridOptions.columnApi.setColumnGroupOpened(v, true);
                        }
                        
                    })
                    // console.log(gridOptions)
                }
            })
        }
    }
    console.log(params)
    return result
}

const onGridReady = (params, gridOptions) => {
    // console.log(params,gridOptions)
    for (const rowData of gridOptions.rowData) {
        for (const rowData_key of Object.keys(rowData)) {
            if(rowData_key.includes('cash')){
                if(rowData[rowData_key] != 0){
                    gridOptions.columnApi.applyColumnState({
                        state: [
                            {
                                colId: rowData_key,
                                hide:false,
                            }
                        ]
                    })
                }
            }
        }
    }
}

export {
    onCellValueChanged,
    getContextMenuItems,
    onGridReady
}


export default {
    onCellValueChanged,
    getContextMenuItems,
    onGridReady
}