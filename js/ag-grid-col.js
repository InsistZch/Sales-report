import dataArr from "../data/index.js"
import api from "./public/api.js"

const showtype = (data, value) => {
    if(value == undefined || value == null || value == "") value = 0
    if(data.day == 'day6' || data.day == 'day7'){
        return `<i style="color:blue;">${value}</i>`
    }else{
        return value
    }
}
const columnDefs = [
    {
      headerName: '日期',
      field:'date',
      menuTabs:[],
      pinned: 'left',
    },
    {
        headerName:'星期',
        field:'week',
        menuTabs:[],
        pinned: 'left',
        cellRenderer: params => {
            return showtype(params.data, params.value)
        }
    },
    {
        headerName:'合计',
        field:'totalMoney',
        suppressMovable: false,
        menuTabs:[],
        pinned: 'left',
        cellClass: 'locked-col',
        cellRenderer: params => {
            // console.log(params)
            let total = 0
            Object.keys(params.data).forEach(v => {
                // 3520-dn2-total-price
                const reg = new RegExp(`\\d{4}-dn\\d-total-price`)
                if(v.match(reg) != null){
                    total += parseInt(params.data[v])
                }
            })
            // console.log(params)
            
            return showtype(params.data, total)
        }
    },
  ];

  const inspect = (userid) => {
    const d = new Set()
    for (const sales_lecord of dataArr.sales_lecord) {
        if(sales_lecord.cus_loc_id == userid){
            d.add(sales_lecord.dinner_type)  
        }
    }
    return d
  }
  let arr = []
  for (const res_company of dataArr.res_company) {

    for (const dinner_mode of dataArr.dinner_mode) {
        if(res_company.company_id == dinner_mode.cus_loc_id){
            const obj = {}
            obj['headerName'] = res_company.name
            obj['field'] = res_company.company_id
            obj['marryChildren'] = true
            obj['groupId'] = res_company.company_id
            const d2 = inspect(res_company.company_id)

            
            obj['children'] = []
            for (const d2_item of d2) {
                
                const headerName = api.convertMealName(d2_item)
                if(headerName == '') break
                const field = `${res_company.company_id}-${d2_item}`
                obj['children'].push({
                    headerName,
                    field,
                    marryChildren:true,
                    columnGroupShow: 'open',
                    groupId:field,
                    menuTabs:[],
                    children:[
                        {
                            headerName:headerName + '份数',
                            field:`${field}-copies`,
                            columnGroupShow: 'open',
                            editable: true,
                            menuTabs:[],
                            cellRenderer: params => showtype(params.data, params.value)
                        },
                        {
                            headerName:'单价',
                            field:`${field}-price`,
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
                                        params.data[`${arr_item}`] = 0
                                        params.data[`${arr_item.replace('copies','price')}`] = 0
                                        total += 0
                                    }else{
                                        total += copies * price
                                    }
                                }

                                params.data[`${q_h}-total-price`] = total
                                // console.log(params.value)
                                return showtype(params.data, params.value) 
                            }
                        },
                        {
                            headerName:'现金',
                            field:`${field}-cash`,
                            columnGroupShow: 'open',
                            editable:true,
                            hide:true,
                            menuTabs:[],
                            cellRenderer: params => {
                                if(params.data[`${field}-cash`] == undefined){
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
                                        total += copies * price
                                    }
                                    // total +=  v.match(reg) != null ? parseInt(params.data[v]) : 0
                                })
                                total += parseInt(params.value)
                                // console.log(params)
                                params.data[`${cols[0]}-${cols[1]}-total-price`] = total
                                // console.log(params.data.date, total)
                                return showtype(params.data, params.value)
                            }
                        },
                        {
                            headerName:headerName + '总份数',
                            field: `${field}-total-copies`,
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
            obj['children'].push(
                {
                    headerName:'总份数',
                    field: res_company.company_id + '-total-Copies',
                    columnGroupShow: 'closed',
                    menuTabs:[],
                    cellRenderer: params => {
                        const {data} = params
                        // console.log(data)
                        const cols = params.colDef.field.split('-')
                        let total = 0
                        for (const data_item of Object.keys(data)) {
                            const data_item_arr = data_item.split('-')
                            const judeg = data_item_arr[data_item_arr.length - 1] == 'copies'
                            if(data_item_arr[0] == cols[0] && judeg){
                                if(data[data_item] != "" && data[data_item] != null && data[data_item] != undefined){
                                    total += parseInt(data[data_item])
                                }else{
                                    data[data_item] += 0
                                }
                            }
                        }
                        
                        return showtype(params.data, total)
                    }
                },
                {
                    headerName: '销售额',
                    field: `${res_company.company_id}-amount`,
                    menuTabs:[],
                    cellRenderer: params => {
                        // console.log(params)
                        // 无法直接获取总份数

                        const col = params.colDef.field.split('-')[0]
                        let total = 0
                        Object.keys(params.data).forEach((v) => {
                            // 3520-dn2-total-price
                            const reg = new RegExp(`${col}-dn\\d-total-price`)
                            total +=  v.match(reg) != null ? parseInt(params.data[v]) : 0
                        })
                        // console.log(params, params.data.date, total)
                        return showtype(params.data, total)
                    }
                }
            )
            arr.push(obj)
            break
        }
    }
  }
  console.log(arr)
  columnDefs.push(...arr)

  export {
    showtype
  }

  export default columnDefs