import data from '../../data/index.js'

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
      pinned: 'left',
    },
    {
        headerName:'星期',
        field:'week',
        pinned: 'left',
        cellRenderer: params => {
            return showtype(params.data, params.value)
        }
    },
    {
        headerName:'合计',
        field:'totalMoney',
        suppressMovable: false,
        cellClass: 'locked-col',
        pinned: 'left',
        cellRenderer: params => {
            let {data} = params
            let arr = Object.keys(data).reduce((pre, v) => {
                const reg = new RegExp('\\d{4}-([0-9a-zA-Z\u4E00-\u9FA5]+)-price')
                if(v.match(reg) != null){
                    pre.push(v)
                }
                return pre
            }, [])
            let total = 0
            for (const arr_item of arr) {
                let c = arr_item.split('-')
                let str = ""
                for(let i = 0; i < c.length - 1; i ++){
                    str += c[i] +'-'
                }
                str = str.substring(0,str.length - 1)
                let category = data[str]
                let price = data[arr_item]
                if(category == undefined || price == undefined) continue
                total += category * price
            }
            for (const d_item of Object.keys(data)) {
                if(d_item.match(/\d{4}-cash/) != null){
                    total += parseInt(data[d_item])
                }
            }
            return showtype(params.data, total)
        }
    },
]
for (const res_company of data.res_company) {
    let obj = {
        headerName:res_company.name,
        field: res_company.company_id,
        groupId: res_company.company_id,
        children:[]
    }
    for (const sales_record2 of data.sales_record2) {
        // 判断用户是否相等
        if(sales_record2.cus_loc_id == res_company.company_id){
            let f = res_company.company_id + '-' + sales_record2['类别']
            let judeg = obj.children.some(v => v.field == f)
            if(!judeg){
                obj.children.push(
                    {
                        headerName:sales_record2['类别'],
                        field:f,
                        columnGroupShow: 'open',
                        editable: true,
                        cellRenderer:params => showtype(params.data, params.value),
                        minWidth: 50,
                    },
                    {
                        headerName:'单价',
                        field: f + '-price',
                        columnGroupShow: 'open',
                        editable: true,
                        cellRenderer:params => showtype(params.data, params.value),
                        minWidth: 50,
                    }
                )
            }
        }
    }
    obj['children'].push(
        {
          headerName:'现金',
          field: res_company.company_id + '-cash',
          editable: true,
          hide:true,
          columnGroupShow: 'closed',
          cellRenderer:params => showtype(params.data, params.value)
        },
        {
            headerName:'销售额',
            field:res_company.company_id + '-' + 'amount',
            columnGroupShow: 'closed',
            cellRenderer: params => {
                let {colDef:{field}} = params
                let {data} = params
                field = field.split('-')

                let total = 0
                // console.log(data)
                for (const key of Object.keys(data)) {
                    // console.log(key)
                    if(key.includes(field[0]) && !key.includes('cash')){
                        let dts = key.split('-')
                        if(dts.length == 2){
                            let category = data[key]
                            let price = data[key + '-price']
                            total += category * price
                        }
                    }
                }
                total += parseInt(data[`${field[0]}-cash`] == undefined ? 0 : data[`${field[0]}-cash`])
                // console.log(total)
                return  showtype(params.data, total)
                // console.log(params)
            }
        },
    )
    columnDefs.push(obj)
}

export {
    showtype
}

export default columnDefs