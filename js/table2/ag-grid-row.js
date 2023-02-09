import data from '../../data/index.js'
// import columnDefs from "./ag-grid-col.js"
// import option from './ag-grid-option.js'
const row = []

const date = (str) => {
    let dateStr = ""
    switch(str){
        case 'day1':
            dateStr = "星期一"
            break;
        case 'day2':
            dateStr = "星期二"
            break;
        case 'day3':
            dateStr = "星期三"
            break;
        case 'day4':
            dateStr = "星期四"
            break;
        case 'day5':
            dateStr = "星期五"
            break
        case 'day6':
            dateStr = "星期六"
            break;
        case 'day0':
            dateStr = "星期日"
            break;
    }
    return dateStr
}
const Alldata = (arr) => {
    const rows = []
    for (const arr_item of arr) {
        let obj = {}
        obj['date'] = arr_item
        obj['week'] = date('day' + new Date(arr_item).getDay())
        for (const res_company of data.res_company) {
            for (const sales_record2 of data.sales_record2) {
                if(sales_record2.cus_loc_id == res_company.company_id && sales_record2.date == arr_item){
                    let name = sales_record2.cus_loc_id + '-' + sales_record2['类别']
                    obj[name] = sales_record2['份数']
                    obj[`${name}-price`] = sales_record2['单价']
                    obj['day'] = sales_record2.weekday
                    if(sales_record2.cash_or_not){
                        // console.log(sales_record2)
                        obj[`${sales_record2.cus_loc_id}-cash`] = sales_record2['金额']
                    }else{
                        obj[`${sales_record2.cus_loc_id}-cash`] = 0
                    }
                    
                }
            }
        }
        row.push(obj)
        // rows.push(obj)
    }
    // console.log(row)
    return row
}
const month_day = (year,month) => {
    let arr = []
    row.length = 0
    for(let i = 1; i <= new Date(year,month,0).getDate(); i ++){
        arr.push(`${year}-${month}-${i}`)
    }
    return arr
    
}

(() => {
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let arr = month_day(year, month)
    Alldata(arr)
})()

const resetData = (year,month) => {
    let arr = month_day(year, month)
    return Alldata(arr)
}

export {
    resetData
}

export default row