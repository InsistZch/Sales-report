import dom from "./customFrom.js"
import columnDefs from './ag-grid-col.js'
import row from "./ag-grid-row.js"
import dataArr from "../data/index.js"
import data from "../data/index.js"
import {showtype} from './ag-grid-col.js'
import {tileData,convertMealName} from './public/api.js'


const categoryStr = (str) => {
    let str1 = ""
    if(str == 'green'){
        str1='绿豆汤'
    }else if(str == 'business'){
        str1 = '商务餐'
    }else if(str == 'instance'){
        str1 = '泡面'
    }else if (str == 'kuai'){
        str1 = '打包'
    }else if(str == 'copies'){
        str1 = "快餐"
    }else{
        str1 = str
    }
    return str1
}



const getContextMenuItems = (params, gridOptions) => {
    // console.log(params)
    const {column} = params
    if(column == null) return 
    const cols = column.colId.split('-')
    const result = []
    // console.log(cols)
    const judeg = cols[0].match(/^\d+$/) != null
    if(judeg){
        result.push(
            {
                name:'新增餐',
                action: () => {
                    const {column:{colId}} = params
                    const colIds = colId.split('-')
                    // dn2
                    let addMeal_category = document.querySelector('#addMeal_category')
                    // 
                    let addMeal_type = document.querySelector('#addMeal_type');
                    
                    const OtherTypeData = []
                    
                    addMeal_category.onchange = () => {
                        typeData(addMeal_category.value)
                    }

                    const type = (arr) => {
                        return arr[1].match(/^dn\d$/) != null ? arr[1] : 'dn2'
                    }
                    // str1 => 代表餐别
                    const typeData = (str1 = "") => {
                        addMeal_type.innerHTML = ""
                        for (const dinner_mode of Object.keys(data.dinner_mode[0])) {
                            // console.log(dinner_mode)
                            const mode_arr = dinner_mode.split('_')
                            if(mode_arr[mode_arr.length - 1] == 'price' && mode_arr.length > 1){
                                let str = categoryStr(mode_arr[0])
                                const value = `${colIds[0]}-${str1 == "" ? type(colIds) : str1}-${mode_arr[0]}-copies`
                                addMeal_type.innerHTML += `<option value="${value}">${str}</option>`
                            }
                        }
                        for (const t_item of OtherTypeData) {
                            console.log(t_item)
                            const value = `${colIds[0]}-${str1 == "" ? type(colIds) : str1}-${t_item}-copies`
                            addMeal_type.innerHTML += `<option value="${value}">${t_item}</option>`
                        }
                        
                    }
                    // const OtherTypeData = (arr = []) => {
                    //     if(arr.length > 0){
                    //         for (const Arr_item of arr) {
                    //             addMeal_type.innerHTML += `<option value="${Arr_item.value}">${Arr_item.name}</option>`
                    //         }
                    //     }
                    // }
                    dom({
                        parent:'#addMeal',
                        cancel:['#addMeal_cancel1','#addMeal_cancel2'],
                        sure:'#addMeal_sure',
                        deleteData:['#addMeal_type'],
                        confirmSuccess: () => {
                            const value = categoryStr(addMeal_type.value)
                            const AllCategory = tileData(columnDefs).reduce((pre, v) => {
                                const reg = new RegExp(`${colIds[0]}-${addMeal_category.value}`)
                                if(v.field.match(reg) != null){
                                    pre.add(v.field.split('-')[2])
                                }
                                return pre
                            }, new Set())
                            // console.log(AllCategory,value)
                            return [...AllCategory].every(v => v != value.split('-')[2])
                            // for (const col_item of digui(columnDefs)) {
                            //     const reg = new RegExp(`${colIds[0]}-${addMeal_category.value}`)
                            //     if(col_item.field.match(reg) != null){
                            //         console.log(col_item)
                            //     }
                            // }
                        },
                        sureFun: () => {

                            // 确认是否存在当前餐别
                            for (const key in columnDefs) {
                                if(columnDefs[key].field == colIds[0]){
                                    const c_field = addMeal_type.value.split('-')
                                    // 确认当前类是否有该餐别
                                    const judeg = [...columnDefs[key].children].some(v => v.field.includes(c_field[1]))
                                        // 没有该餐别
                                        if(!judeg){
                                            const category = `${c_field[0]}-${c_field[1]}`
                                            columnDefs[key].children.splice(columnDefs[key].children.length - 1, 0, {
                                                columnGroupShow: "open",
                                                field: category,
                                                groupId: category,
                                                headerName: convertMealName(c_field[1]),
                                                marryChildren: true,
                                                menuTabs: [],
                                                children:[
                                                    {
                                                        headerName:'现金',
                                                        field:`${category}-cash`,
                                                        columnGroupShow: 'open',
                                                        editable:true,
                                                        hide:true,
                                                        menuTabs:[],
                                                        cellRenderer: params => {
                                                            if(params.data[`${category}-cash`] == undefined){
                                                                return showtype(params.data, 0)
                                                            }
                                                            const cols = params.colDef.field.split('-')
                                                            let total = 0
                                                            Object.keys(params.data).forEach((v) => {
                                                                // 3520-dn2-total-price
                                                                const reg = new RegExp(`${cols[0]}-${cols[1]}(-[0-9a-zA-Z\u4E00-\u9FA5]+)?-copies`)
                                                                if(v.match(reg) != null){
                                                                    const copies = params.data[v]
                                                                    const price = params.data[v.replace('copies','price')]
                                                                    if(copies == undefined || price == undefined){
                                                                        total += 0
                                                                    }else{
                                                                        total += copies * price
                                                                    }
                                                                    
                                                                }
                                                                // total +=  v.match(reg) != null ? parseInt(params.data[v]) : 0
                                                            })
                                                            if(isNaN(parseInt(params.value))){
                                                                total += 0
                                                            }else{
                                                                total += parseInt(params.value)
                                                            }
                                                            // console.log(params)
                                                            params.data[`${cols[0]}-${cols[1]}-total-price`] = total
                                                            // console.log(params.data.date, total)
                                                            return showtype(params.data, params.value)
                                                        }
                                                    },
                                                    {
                                                        headerName:convertMealName(c_field[1]) + '总份数',
                                                        field: `${category}-total-copies`,
                                                        columnGroupShow: 'closed',
                                                        menuTabs:[],
                                                        cellRenderer: (params) => {
                                                            const {data} = params
                                                            // console.log(params)
                                                            const cols = params.colDef.field.split('-')
                                                            let total = 0
                                                            for (const data_item of Object.keys(data)) {
                                                                const data_item_arr = data_item.split('-')
                                                                let judeg = data_item_arr[data_item_arr.length - 1] == 'copies'
                                                                judeg = judeg && cols[1] == data_item_arr[1]
                                                                if(data_item_arr[0] == cols[0] && judeg){
                                                                    if(isNaN(parseInt(data[data_item]))){
                                                                        total += 0
                                                                    }else{
                                                                        total += parseInt(data[data_item])
                                                                    }
                                                                    
                                                                }
                                                            }
                                                            for (const dinner_mode of dataArr.dinner_mode) {
                                                                let judeg = dinner_mode.cus_loc_id == cols[0]
                                                                judeg = judeg && dinner_mode.weekday == data.day
                                                                judeg = judeg && dinner_mode.dinner_type == cols[1]
                                                                if(judeg){
                                                                    // console.log(total)
                                                                    if(total > dinner_mode.dinner_qty_upper_limit){
                                                                        total = `<span style="color:red;">${total}</span>`
                                                                    }
                                                                }
                                                            }
                                                            return showtype(params.data, total)
                                                        }
                                                    },
                                                
                                                ]
                                            })
                                        }
                                }
                            }
                            // gridOptions.api.setColumnDefs(columnDefs)
                            for (const col_item of columnDefs) {
                                // 确认用户名一致
                                if(col_item.field == colIds[0]){
                                    // console.log(col_item.field, colIds[0])
                                    for (const children of col_item.children) {
                                        const c_name = addMeal_type.querySelector(`option[value="${addMeal_type.value}"]`)
                                        const c_field = addMeal_type.value.split('-')
                                        // console.log(c_name, c_field)
                                        
                                        // console.log(judeg)

                                        // 确认餐别一致
                                        // console.log(`${c_field[0]}-${c_field[1]}`,children.field)
                                        if(`${c_field[0]}-${c_field[1]}` == children.field && judeg){
                                            
                                            let f = ""
                                            for (let i = 0; i < c_field.length - 1; i++) {
                                                f += c_field[i] + '-'
                                            }
                                            const arr = [
                                                {
                                                    headerName:c_name.innerText,
                                                    field:c_field.join('-'),
                                                    columnGroupShow: 'open',
                                                    editable: true,
                                                    menuTabs:[],
                                                    cellRenderer: params => {
                                                        // console.log(params)
                                                        return showtype(params.data, params.value)
                                                    }
                                                },
                                                {
                                                    headerName:'单价',
                                                    field: f + 'price',
                                                    columnGroupShow: 'open',
                                                    editable: true,
                                                    menuTabs:[],
                                                    cellRenderer:(params) => {
                                                        // console.log(params)
                                                        const cols = params.colDef.field.split('-')
                                                        let q_h = cols[0] + '-' + cols[1]
                                                        let total = 0
                                                        const arr = Object.keys(params.data).reduce((pre,v) => {
                                                            const reg = new RegExp(`${q_h}-\.+`)
                                                            const judeg = !v.includes('total') && !v.includes('cash') && !v.includes('price')
                                                            if(v.match(reg) != null && judeg)pre.push(v)
                                                            return pre
                                                        }, [])
                                                        for (const arr_item of arr) {
                                                            let copies = params.data[arr_item]
                                                            let price = params.data[arr_item.replace('copies','price')]
                                                            if(copies == undefined || price == undefined){
                                                                total += 0
                                                            }else{
                                                                total += copies * price
                                                            }
                                                            
                                                        }
                        
                                                        params.data[`${q_h}-total-price`] = total
                                                        return showtype(params.data, params.value)
                                                    }
                                                }
                                            ]
                                            // 把新增列的数据添加进表格
                                            for (const i in row) {
                                                row[i][`${c_field.join('-')}`] = 0
                                                for (const dinner_mode of data.dinner_mode) {
                                                    // 确定到单行数据
                                                    let judeg = dinner_mode.cus_loc_id == c_field[0] && 
                                                    dinner_mode.weekday == params.node.data['day'] &&
                                                    dinner_mode.dinner_type == c_field[1]
                                                    if(judeg){
                                                        let arr = Object.keys(dinner_mode).reduce((pre, v) => {
                                                            if(v.includes('price')){
                                                                pre.push(v)
                                                            }
                                                            return pre
                                                        }, [])
                                                        for (const arr_item of arr) {
                                                            // console.log(arr_item)
                                                            let a_is = arr_item.split('_')
                                                            if(f.includes(a_is[0])){
                                                                // console.log(dinner_mode[arr_item])
                                                                row[i][f + 'price'] = dinner_mode[arr_item]
                                                                break
                                                            }
                                                        }
                                                        
                                                        row[i][f + 'price'] = row[i][f + 'price']== undefined ? 1 : row[i][f + 'price']
                                                        
                                                    }
                                                    // console.log(row[i])
                                                }
                                            }
                                            // console.log(arr,children)

                                            // 检查是否有本餐类别
                                            
                                            children['children'].splice(children['children'].length - 2, 0, ...arr)
                                        }
                                    }
                                }
                            }
                            gridOptions.api.setColumnDefs(columnDefs)
                            // 展开页面
                            const groupNames = data.res_company.map(v => v.company_id + "")
                            groupNames.forEach((groupId) => {
                                let arr = ['dn2','dn3','dn5']
                                if(groupId == cols[0]){
                                    gridOptions.columnApi.setColumnGroupOpened(groupId, true);
                                    for (const arr_item of arr) {
                                    gridOptions.columnApi.setColumnGroupOpened(groupId + "-" + arr_item, true);
                                    }
                                }
                              });
                            // gridOptions.api.refreshCells({force:true})
                        },
                        initial: () => {
                            typeData()
                            let addCategory_sure = document.querySelector('#addCategory_sure')
                            let addCategory_name = document.querySelector('#cate_name')
                            addCategory_sure.onclick = () => {
                                // typeData(addCategory_name.value)
                                const value = `${colIds[0]}-${addMeal_category.value}-${addCategory_name.value}-copies`
                                addMeal_type.innerHTML += `<option selected value="${value}">${addCategory_name.value}</option>`
                                OtherTypeData.push(addCategory_name.value)
                            }
                        }
                    })
                }
            },
        )
        const is_cash = cols[1].match(/^(dn)\d$/)
        if(cols[cols.length - 1] != 'amount' && is_cash){
            result.push(
                {
                    name:'修改餐单价',
                    action: () => {
                        // console.log(params)
                        const up = document.querySelector('#updateMealPrice_price')
                        const up_c = document.querySelector('#updateMealPrice_category')
                        const arr = []
                        
                        dom({
                            parent:'#updateMealPrice',
                            cancel:["#updateMealPrice_cancel1","#updateMealPrice_cancel2"],
                            sure:'#updateMealPrice_sure',
                            deleteData:['#updateMealPrice_category'],
                            sureFun:() => {
                                params.node.data[up_c.value] = up.value
                                // console.log(up_c.value)
                                const cols = params.column.colDef.field.split('-')
                                let q_h = cols[0] + '-' + cols[1]
                                let total = 0
                                const arr = Object.keys(params.node.data).reduce((pre,v) => {
                                    const reg = new RegExp(`${q_h}-\.+`)
                                    const judeg = !v.includes('total') && !v.includes('cash') && !v.includes('price')
                                    if(v.match(reg) != null && judeg)pre.push(v)
                                    return pre
                                }, [])
                                for (const arr_item of arr) {
                                    let copies = params.node.data[arr_item]
                                    let price = params.node.data[arr_item.replace('copies','price')]
                                    total += copies * price
                                }

                                params.node.data[`${q_h}-total-price`] = total
                                gridOptions.api.refreshCells({force:true})
                            },
                            initial:() => {

                                // 找到所有的类别
                                console.log(params.node.data)
                                for (const keys of Object.keys(params.node.data)) {
                                    let cols = params.column.colId.split('-')
                                    if(keys.includes('copies') && keys.includes(`${cols[0]}-${cols[1]}`)){
                                        arr.push(keys)
                                        const value = categoryStr(keys.split('-')[2])
                                        // console.log(keys.split('-')[2])
                                        console.log(value)
                                        up_c.innerHTML += `<option value="${keys.replace('copies', 'price')}">${value}</option>`
                                        up.value = 10
                                    }
                                }
                                up_c.onchange = () => {
                                    up.value = params.node.data[up_c.value]
                                } 
                            }
                        })
                    }
                },
                {
                    name:'显示现金列',
                    action: () => {
                        let {column:{colId}} = params
                        colId = colId.split('-')
                        console.log(colId,colId[2] == 'total')
                        gridOptions.columnApi.applyColumnState({
                            state: [
                                {
                                    colId: `${colId[0]}-${colId[1]}-cash`,
                                    hide:false,
                                }
                            ]
                        })
                        console.log(colId)

                    }
                }
            )
            if(cols[cols.length - 2] != "total"){
                if(cols[cols.length - 1] == 'copies' || cols[cols.length - 1] == "price"){
                    result.push({
                        name: '删除餐',
                        action: () => {
                            for(let i = 0; i < 2; i++){
                                for (const colKey in columnDefs) {
                                    if(columnDefs[colKey].children != null && columnDefs[colKey].field == cols[0]){
                                        for (const ChildKey in columnDefs[colKey].children) {
                                            if(columnDefs[colKey].children[ChildKey].field.includes(`${cols[0]}-${cols[1]}`)){
                                                for (const key in columnDefs[colKey].children[ChildKey].children) {
                                                    const value = columnDefs[colKey].children[ChildKey].children[key]
                                                    // console.log(value)
                                                    if(value.field == column || value.field == column.colId.replace('copies', 'price') || value.field == column.colId.replace('price', 'copies')) {
                                                        // delete columnDefs[colKey].children[ChildKey].children[key]
                                                        columnDefs[colKey].children[ChildKey].children.splice(key, 1)
                                                    }
                                                    // if(value.includes(`${}`))
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            for (const rdKey in gridOptions.rowData) {
                                for (const keys of Object.keys(gridOptions.rowData[rdKey])) {
                                    // console.log(gridOptions.rowData[rdKey][keys])
                                    // const value = String(gridOptions.rowData[rdKey][keys])
                                    if(keys == column.colId || keys == column.colId.replace('copies', 'price') || keys == column.colId.replace('price', 'copies')){
                                        delete gridOptions.rowData[rdKey][keys]
                                    }
                                }
                            }
                            gridOptions.api.setColumnDefs(columnDefs)
                            gridOptions.api.refreshCells({force:true})
                            const groupNames = data.res_company.map(v => v.company_id + "")
                            groupNames.forEach((groupId) => {
                                let arr = ['dn2','dn3','dn5']
                                if(groupId == cols[0]){
                                    gridOptions.columnApi.setColumnGroupOpened(groupId, true);
                                    for (const arr_item of arr) {
                                    gridOptions.columnApi.setColumnGroupOpened(groupId + "-" + arr_item, true);
                                    }
                                }
                              });
                            
                        }
                    })
                }
            }
        }
    }
    // result.push(...params.defaultItems)
    return result
}



const onCellValueChanged = (params, gridOptions) => {
    if(isNaN(params.newValue)){
        params.data[`${params.colDef.field}`] = params.oldValue
    }
    document.querySelector('#updateTips').classList.remove('isHide')
    gridOptions.api.refreshCells({force:true})
}


export {
    getContextMenuItems,
    onCellValueChanged,
}


export default {
    getContextMenuItems,
    onCellValueChanged,
}