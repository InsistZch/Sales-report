import data from "../data/index.js"
import columnDefs from "./ag-grid-col.js"
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

// let arr = []
// for (const res_company of data.res_company) {
//     // let obj = {}
//     /*
//         {
//             date
//             week
//             当天总销售额

//             每一用户当天总份数
            
//             中餐总份数

//             中餐份数
//             单价
//             商务餐份数
//             是否现金

//             晚餐总份数
//             夜餐总份数

//             销售额
//         }
//     */
// }
const Alldata = (arr) => {
    const rows = []
    for (const arr_item of arr) {
        let obj = {}
        obj['date'] = arr_item
        obj['week'] = date('day' + new Date(arr_item).getDay())
        
        for (const sales_lecord of data.sales_lecord) {
            if(arr_item == sales_lecord.date){
                obj['day'] = sales_lecord.weekday
                for (const res_company of data.res_company) {
                    for (const sales_lecord2 of data.sales_lecord) {
                        if(res_company.company_id == sales_lecord2.cus_loc_id && arr_item == sales_lecord2.date){
                            let str = `${res_company.company_id}-${sales_lecord2.dinner_type}`
                            obj[`${str}-copies`] = sales_lecord2['份数']
                            obj[`${str}-price`] = sales_lecord2['单价']
                            obj[`${str}-total-price`] = sales_lecord2['金额']
                            if(sales_lecord2['cash_or_not'] == false){
                                obj[`${str}-cash`] = 0
                            }else{
                                obj[`${str}-cash`] = sales_lecord2['金额']
                                // 判断是否有现金 如果有，就显示现金列
                                const arr = columnDefs.forEach((v) => {
                                    if(!isNaN(v.field)){
                                        for (const children of v.children) {
                                            const fields = children.field.split('-')
                                            if(fields[1].includes('dn')){
                                                for (const cc of children.children) {
                                                    if(cc.field == `${str}-cash`){
                                                        cc.hide = false
                                                    }
                                                }
                                            }
                                        }
                                        
                                    }
                                },[])
                                // console.log(arr)
                            }
                            
                        }
                    }
                }
                // console.log(obj)
                break
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
    // let year = new Date().getFullYear()
    // let month = new Date().getMonth() + 1
    let arr = month_day('2022', '8')
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