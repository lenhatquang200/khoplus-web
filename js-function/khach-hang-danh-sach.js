$(document).ready(async function () {
    tools.loader('.container-content', true)
    let response = await tools.ajaxGet("/customers")
    let listBranch = await tools.ajaxGet("/branches")
    let listCustomerGroup = await tools.ajaxGet("/customer-groups")
    $('#txtBranch').on('input', function () {
        let _listBranch = listBranch.data
        tools.select('#txtBranch', $(this).val(), _listBranch, id => {
            let data = _listBranch.filter(item => item.id.toString() === id.toString())
            if (data.length) {
                data = data[0]
                $('#txtBranch').attr('data-id', data.id).val(data.name)
            }
        })
    })
    $('#txtGroup').on('input', function () {
        let _listGroup = listCustomerGroup.data
        tools.select('#txtGroup', $(this).val(), _listGroup, id => {
            let data = _listGroup.filter(item => item.id.toString() === id.toString())
            if (data.length) {
                data = data[0]
                $('#txtGroup').attr('data-id', data.id).val(data.name)
            }
        })
    })
    if (response.success) {
        const list = []
        let num = 1
        response.data.map(item => {
            item.customer_branch.text = item.customer_branch.name
            item.customer_group.text = item.customer_group.name
            list.push({
                num: num++,
                id: item.id,
                branch: item.customer_branch,
                group: item.customer_group,
                name: item.name,
                phone: item.phone,
                address: item.address,
                note: item.note,
                formatted_created_at: item.formatted_created_at
            })
        })
        let table = tools.table.init({
            id: '#table',
            columns: [
                {name: "num", value: "Số", align: 'center', style: {'text-align': 'center', width: '80px'}},
                {name: "branch", value: "Kho"},
                {name: "group", value: "Nhóm"},
                {name: "name", value: "Tên Khách"},
                {name: "phone", value: "Số Điện Thoại"},
                {name: "address", value: "Địa Chỉ"},
                {name: "note", value: "Ghi Chú"},
                {name: "formatted_created_at", value: "TG Tạo", style: {width: '200px'}},
            ],
            colsSearch: ['name'],
            actions: {
                delete: true,
                edit: true,
                detail: false
            },
            data: list,
            handleActions: {
                delete: deleteRow,
                edit: editRow,
            },
        })
        const SaveAndUpdate = (b) => {
            $('#modalFormSubmit').attr('data-type', b ? 1 : 0)
            if (b) {
                $('.btnSave').css('display', 'block')
                $('.btnUpdate').css('display', 'none')
                let user = tools.getUserInfo()
                $('#txtBranch').attr('data-id', user.current_branch.id).val(user.current_branch.name)
            } else {
                $('.btnSave').css('display', 'none')
                $('.btnUpdate').css('display', 'block')
                $('#modalFormSubmit .btnUpdate').off('click').on('click', function () {
                    $('#modalFormSubmit').trigger('submit')
                })
            }
        }
        $('#btnModalForm').click(function (e) {
            SaveAndUpdate(true)
        })
        $('#modalFormSubmit').submit(async e => {
            const type = parseInt($('#modalFormSubmit').attr('data-type'))
            let name = $("#txtName").val()
            let phone = $("#txtPhone").val()
            let address = $("#txtAddress").val()
            let note = $("#txtNote").val()
            let customer_group = $("#txtGroup").attr('data-id')
            let branch_id = $("#txtBranch").attr('data-id')
            if (type) {
                const response = await tools.ajaxPost("/customers", {
                    name: name,
                    phone: phone,
                    address: address,
                    note: note,
                    customer_group: customer_group
                })
                if (response.success) {
                    $('#modalFormSubmit')[0].reset()
                    $('#txtName')
                        .attr('data-trid', '')
                        .attr('data-id', '')
                        .focus()
                    $("#txtBranch").attr('data-id', '')
                    response.data.customer_branch.text = response.data.customer_branch.name
                    response.data.customer_group.text = response.data.customer_group.name
                    let row = {
                        num: list.length + 1,
                        id: response.data.id,
                        branch_id: response.data.branch_id,
                        branch: response.data.customer_branch,
                        group: response.data.customer_group,
                        name: response.data.name,
                        phone: response.data.phone,
                        address: response.data.address,
                        note: response.data.note,
                        formatted_created_at: response.data.formatted_created_at,
                    }
                    table.addRow(row)
                    tools.toast("success", "Khách hàng", "Tạo mới thành công.")
                } else {
                    tools.toast("error", "Khách hàng", "Lỗi, vui lòng kiểm tra lại.")
                }
            } else {
                //update row
                const trId = $("#txtName").attr('data-trid')
                const id = $("#txtName").attr('data-id')
                const response = await tools.ajaxPut("/customers/" + id, {
                    name: name,
                    phone: phone,
                    address: address,
                    note: note,
                    branch_id: branch_id,
                    customer_group: customer_group,
                })
                if (response.success) {
                    response.data.customer_branch.text = response.data.customer_branch.name
                    response.data.customer_group.text = response.data.customer_group.name
                    table.updateRow({id: id, trId: trId}, {
                        name: name,
                        phone: phone,
                        address: address,
                        note: note,
                        branch: response.data.customer_branch,
                        branch_id: branch_id,
                        group: response.data.customer_group,
                    })
                    tools.toast("success", "Khách hàng", "Cập nhật thành công.")
                } else {
                    tools.toast("error", "Khách hàng", "Lỗi, vui lòng kiểm tra lại.")
                }
            }
        })

        async function deleteRow(data) {
            const response = await tools.ajaxDelete("/customers/" + data.id)
            if (response.success) {
                table.deleteRow(data)
                tools.toast("success", "Khách hàng", "Xóa thành công.")
            } else {
                tools.toast("error", "Khách hàng", "Lỗi, vui lòng kiểm tra lại.")
            }
        }

        async function editRow(data, table) {
            $('#btnModalForm').click()
            SaveAndUpdate(false)
            let obj = table.rootData.filter(item => item.id.toString() === data.id.toString())
            if (obj.length === 0) {
                Swal.fire({
                    title: "ID không tồn tại!",
                    html: `Vui lòng tải lại trang hiện tại để cập nhật dữ liệu.`,
                    icon: "error"
                })
                return
            }
            obj = obj[0]
            $('#txtName')
                .attr('data-trid', data.trId)
                .attr('data-id', obj.id)
                .val(obj.name)
            $('#txtPhone').val(obj.phone)
            $('#txtAddress').val(obj.address)
            $('#txtNote').val(obj.note)
            console.log(obj)
            $('#txtBranch').attr('data-id', obj.branch.id).val(obj.branch.name)
            $('#txtGroup').attr('data-id', obj.group.id).val(obj.group.name)
        }
    }
    IMask($('#txtPhone')[0], {mask: "0000-000-000"});
    tools.loader('.container-content', false)
})

