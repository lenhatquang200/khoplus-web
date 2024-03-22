$(document).ready(async function () {
    let response = await tools.ajaxGet("/product-types")
    if (response.success) {
        const list = []
        let num = 1
        response.data.map(item => {
            list.push({
                num: num++,
                id: item.id,
                name: item.name,
                formatted_created_at: item.formatted_created_at
            })
        })
        let table = tools.table.init({
            id: '#table',
            columns: [
                {name: "num", value: "Số", align: 'center', style: {'text-align': 'center', width: '80px'}},
                {name: "name", value: "Nhóm"},
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
            if (type) {
                const response = await tools.ajaxPost("/product-types", {
                    name: name
                })
                if (response.success) {
                    $('#modalFormSubmit')[0].reset()
                    $('#txtName')
                        .attr('data-trid', '')
                        .attr('data-id', '')
                        .focus()
                    let row = {
                        num: list.length + 1,
                        id: response.data.id,
                        name: response.data.name,
                        formatted_created_at: response.data.formatted_created_at,
                    }
                    table.addRow(row)
                    tools.toast("success", "Nhóm hàng hóa", "Tạo mới thành công.")
                } else {
                    tools.toast("error", "Nhóm hàng hóa", "Lỗi, vui lòng kiểm tra lại.")
                }
            } else {
                //update row
                const trId = $("#txtName").attr('data-trid')
                const id = $("#txtName").attr('data-id')
                const response = await tools.ajaxPut("/product-types/" + id, {
                    name: name
                })
                if (response.success) {
                    table.updateRow({id: id, trId: trId}, {name: name})
                    tools.toast("success", "Nhóm hàng hóa", "Cập nhật thành công.")
                } else {
                    tools.toast("error", "Nhóm hàng hóa", "Lỗi, vui lòng kiểm tra lại.")
                }
            }
        })

        async function deleteRow(data) {
            const response = await tools.ajaxDelete("/product-types/" + data.id)
            if (response.success) {
                table.deleteRow(data)
                tools.toast("success", "Nhóm hàng hóa", "Xóa thành công.")
            } else {
                tools.toast("error", "Nhóm hàng hóa", "Lỗi, vui lòng kiểm tra lại.")
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
        }
    }
})

