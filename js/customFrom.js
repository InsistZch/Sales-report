

// {
// parent => str
// cancel => array[string]
// sure => string
// deleteData => array[string]
// cancelFun => function
// sureFun => function
// initial => function
// confirmSuccess => function 
// }

const dom = ({
    parent,cancel,sure,deleteData,
    cancelFun = () => {},
    sureFun= () => {},
    initial = () => {},
    confirmSuccess,
}) => {
    const _parent = document.querySelector(parent)

    const _sure = document.querySelector(sure)
    // 删除数据
    const deldata = () => {
        for (const deleteData_item of deleteData) {
            _parent.querySelector(deleteData_item).innerHTML = ""
        }
    }

    // 显示页面
    _parent.style.display = 'block'
    initial()
    // 取消页面
    for (const cancel_item of cancel) {
        const _cancel_item = document.querySelector(cancel_item)
        _cancel_item.onclick = () => {
            cancelFun()
            deldata()
            _parent.style.display = 'none'
        }
    }
    _sure.onclick = () => {
        
        if(confirmSuccess == null){
            sureFun()
            deldata()
            _parent.style.display = 'none'
        }else{
            if(confirmSuccess()){
                sureFun()
                deldata()
                _parent.style.display = 'none'
            }else{
                const danger = document.createElement('div')
                danger.id = `danger-alert`
                danger.style.cssText = `
                position: absolute;
                left: 50%;
                top: 10%;
                transform: translate(-50%, -50%);
                `
                danger.innerHTML = `
                <div class="alert alert-danger alert-dismissible" role="alert">
                    <div>餐品已存在或操作失败</div>
                </div>
                `
                setTimeout(() => {
                    _parent.removeChild(_parent.querySelector('#danger-alert'))
                }, 500)
                _parent.append(danger)
            }
        }
        
    }
    return _parent
}

export default dom