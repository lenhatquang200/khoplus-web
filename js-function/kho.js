$(document).ready(async function () {
    let response = await tools.ajaxGet("/branches")
    if (response.success) {
        const list = []
        let num = 1
        response.data.map(item => {
            list.push({
                num: num++,
                id: item.id,
                name: item.name,
                phone: item.phone,
                address: item.address,
                formatted_created_at: item.formatted_created_at
            })
        })
        let table = tools.table.init({
            id: '#table',
            columns: [
                {name: "num", value: "Số", align: 'center', style: {'text-align': 'center', width: '80px'}},
                {name: "name", value: "Kho"},
                {name: "phone", value: "Số Điện Thoại"},
                {name: "address", value: "Địa Chỉ"},
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
            if (type) {
                const response = await tools.ajaxPost("/branches", {
                    name: name,
                    phone: phone,
                    address: address
                })
                if (response.success) {
                    $('#modalFormSubmit')[0].reset()
                    $("#txtName")
                        .attr('data-trid', '')
                        .attr('data-id', '')
                        .focus()
                    let row = {
                        num: list.length + 1,
                        id: response.data.id,
                        name: response.data.name,
                        phone: response.data.phone,
                        address: response.data.address,
                        formatted_created_at: response.data.formatted_created_at,
                    }
                    table.addRow(row)
                    tools.toast("success", "Kho", "Tạo mới thành công.")
                } else {
                    tools.toast("error", "Kho", "Lỗi, vui lòng kiểm tra lại.")
                }
            } else {
                //update row
                const trId = $("#txtName").attr('data-trid')
                const id = $("#txtName").attr('data-id')
                const response = await tools.ajaxPut("/branches/" + id, {
                    name: name,
                    phone: phone,
                    address: address
                })
                if (response.success) {
                    table.updateRow({id: id, trId: trId}, {
                        name: name,
                        phone: phone,
                        address: address
                    })
                    tools.toast("success", "Kho", "Cập nhật thành công.")
                } else {
                    tools.toast("error", "Kho", "Lỗi, vui lòng kiểm tra lại.")
                }
            }
        })

        async function deleteRow(data) {
            const response = await tools.ajaxDelete("/branches/" + data.id)
            if (response.success) {
                table.deleteRow(data)
                tools.toast("success", "Kho", "Xóa thành công.")
            } else {
                tools.toast("error", "Kho", "Lỗi, vui lòng kiểm tra lại.")
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
            $("#txtPhone").val(obj.phone)
            $("#txtAddress").val(obj.address)
        }

        IMask($('#txtPhone')[0], {mask: "0000-000-000"});
    }
})

