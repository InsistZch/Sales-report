import data from "../../data/index.js"

// 列的展开与收缩
const showAndHide = (btn, gridOptions) => {
    
    let expand = true
    // console.log(columnDefs)
    const expandAll = () => {
        const groupNames = data.res_company.map(v => v.company_id + "")
        
        groupNames.forEach((groupId) => {
          let arr = ['dn2','dn3','dn5']
        //   console.log(groupId)
          gridOptions.columnApi.setColumnGroupOpened(groupId, expand);
          for (const arr_item of arr) {
            gridOptions.columnApi.setColumnGroupOpened(groupId + "-" + arr_item, expand);
          }
        });
        expand = !expand
    }
    btn.onclick = () => {
        expandAll()
        btn.innerText = expand ? "展开" : "收缩"
        // console.log(gridOptions)
    }
}


// 保存按钮
const preservation = (pre, {rowData}) => {
    pre.onclick = () => {
        /*
        3520-dn2-cash: 0   3520 => 用户ID   dn2 => 午餐   cash => 现金
        copies => 份数     green-copies => 绿豆汤份数
        price => 价格      green-price => 绿豆汤价格

        3520-dn2-total-price: 2310 用户3520中餐总价

        date 日期
        day  对应数据库 weekday字段
        week 星期
        */
        console.log(rowData)
        // const d = rowData.map(v => {
        //     // const users = 
        //     const users = new Set(Object.keys(v).reduce((pre, v) => {
        //         const reg = new RegExp('\\d+')
        //         if(v.split('-')[0].match(reg) != null){
        //             pre.push(v.split('-')[0])
        //         }
        //         return pre
        //     }, []))

        //     console.log(v, users)
        // })
        document.querySelector('#updateTips').classList.add('isHide')
    }
}


// 显示日期
const selectDate = (sd, gridOptions,resetData) => {
    // console.log(gridOptions)
    addData(sd)
    sd.onchange = () => {
        let values = sd.value.split('-')
        // console.log(values)
        
        gridOptions.api.setRowData(resetData(values[0],values[1]))
    }
}

// 显示单价
const showCash = (sc, gridOptions) => {
    let expand = true
    sc.onclick = () => {
        // console.log(gridOptions)
        let arr = []
        for (const tileData_item of tileData(gridOptions.columnDefs)) {
            if(tileData_item.headerName =='单价'){
                arr.push({
                    colId:tileData_item.field,
                    hide:expand
                })
            }
        }

        gridOptions.columnApi.applyColumnState({
            state: [...arr]
        })
        expand = !expand
        sc.innerText = expand ? '隐藏单价列' : '显示单价列'
    }
}

const addData = (el) => {
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1

    for(let i = 2; i > 0; i--){
        let month2 = 0
        if(month + i >= 12){
            month = month + i - 12
            year = year + 1
        }else {
            month2 = month + i - 1
        }
        if(i == 1){
            el.innerHTML += `<option selected value="${year}-${month2}">${year}-${month2}</option>`
        }else{
            el.innerHTML += `<option value="${year}-${month2}">${year}-${month2}</option>`
        }
    }
    year = new Date().getFullYear()
    month = new Date().getMonth() + 1
    
    for(let i = 0; i < 6; i++){
        
        if(month - 1 <= 0){
            month = 12
            year = year - 1
        }else {
            month -= 1
        }
        el.innerHTML += `<option value="${year}-${month}">${year}-${month}</option>`
    }
}

// 找出所有列
const tileData = (data) => {
    let arr = []
    const ar = (data) => {
        for (const d_item of data) {
            if(d_item.children == undefined){
                arr.push(d_item) 
            }else{
                ar(d_item.children)
            }
        }
    }
    ar(data)
    return arr
}


// 转换餐名
const convertMealName = (str) => {
    return str == 'dn2' ? '中餐' : str == 'dn3' ? '晚餐' : str == 'dn5' ? '夜餐' : str == 'dn1' ? '早餐' : ''
}

export {
    showAndHide,
    preservation,
    selectDate,
    showCash,
    tileData,
    convertMealName
}

export default {
    showAndHide,
    preservation,
    selectDate,
    showCash,
    tileData,
    convertMealName
}