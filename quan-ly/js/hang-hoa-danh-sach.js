$(document).ready(async function () {
    let listProduct = await tools.ajaxGet("/products")
    if (listProduct.success) {
        const list = []
        let num = 1
        listProduct.data.map(item => {
            item.type.text = item.type.name
            item.unit.text = item.unit.name
            item.group.text = item.group.name
            list.push({
                num: num++,
                id: item.id,
                code: item.code,
                name: item.name,
                unit: item.unit,
                type: item.type,
                group: item.group,
                formatted_created_at: item.formatted_created_at
            })
        })
        let table = tools.table.init({
            id: '#table',
            columns: [
                {name: "num", value: "Số", align: 'center', style: {'text-align': 'center', width: '80px'}},
                {name: "code", value: "Mã"},
                {name: "name", value: "Hàng Hoá"},
                {name: "unit", value: "ĐVT"},
                {name: "type", value: "Loại"},
                {name: "group", value: "Nhóm"},
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

        let listType = await tools.ajaxGet("/product-types")
        let listGroup = await tools.ajaxGet("/product-groups")
        let listUnit = await tools.ajaxGet("/product-units")
        $('#txtType').on('input', function () {
            let _listType = listType.data
            tools.select('#txtType', $(this).val(), _listType, id => {
                let data = _listType.filter(item => item.id.toString() === id.toString())
                if (data.length) {
                    data = data[0]
                    $('#txtType').attr('data-id', data.id).val(data.name)
                }
            })
        })
        $('#txtGroup').on('input', function () {
            let _listGroup = listGroup.data
            tools.select('#txtGroup', $(this).val(), _listGroup, id => {
                let data = _listGroup.filter(item => item.id.toString() === id.toString())
                if (data.length) {
                    data = data[0]
                    $('#txtGroup').attr('data-id', data.id).val(data.name)
                }
            })
        })
        $('#txtUnit').on('input', function () {
            let _listUnit = listUnit.data
            tools.select('#txtUnit', $(this).val(), _listUnit, id => {
                let data = _listUnit.filter(item => item.id.toString() === id.toString())
                if (data.length) {
                    data = data[0]
                    $('#txtUnit').attr('data-id', data.id).val(data.name)
                }
            })
        })

        const SaveAndUpdate = (b) => {
            $('#modalFormSubmit').attr('data-type', b ? 1 : 0)
            if (b) {
                $('.btnSave').css('display', 'block')
                $('.btnUpdate').css('display', 'none')
                $('#txtCode').val(new Date().getTime())
                $("#txtUnit").attr('data-id', '')
                $("#txtType").attr('data-id', '')
                $("#txtGroup").attr('data-id', '')
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
            let unit_id = $("#txtUnit").attr('data-id')
            let type_id = $("#txtType").attr('data-id')
            let group_id = $("#txtGroup").attr('data-id')
            let code = $("#txtCode").val()
            if (type) {
                const response = await tools.ajaxPost("/products", {
                    name: name,
                    type_id: type_id,
                    group_id: group_id,
                    unit_id: unit_id,
                    code: code,
                })
                if (response.success) {
                    $('#modalFormSubmit')[0].reset()
                    $('#txtCode').val(new Date().getTime())
                    $("#txtUnit").attr('data-id', '')
                    $("#txtType").attr('data-id', '')
                    $("#txtGroup").attr('data-id', '')
                    $("#txtName").focus()
                    response.data.unit.text = response.data.unit.name
                    response.data.type.text = response.data.type.name
                    response.data.group.text = response.data.group.name
                    let row = {
                        num: list.length + 1,
                        id: response.data.id,
                        code: response.data.code,
                        name: response.data.name,
                        unit: response.data.unit,
                        unit_id: unit_id,
                        type: response.data.type,
                        type_id: type_id,
                        group: response.data.group,
                        group_id: group_id,
                        formatted_created_at: response.data.formatted_created_at,
                    }
                    table.addRow(row)
                    tools.toast("success", "Hàng hóa", "Tạo mới thành công.")
                } else {
                    tools.toast("error", "Hàng hóa", "Lỗi, vui lòng kiểm tra lại.")
                }
            } else {
                //update row
                const trId = $("#txtName").attr('data-trid')
                const id = $("#txtName").attr('data-id')
                const response = await tools.ajaxPut("/products/" + id, {
                    name: name,
                    type_id: type_id,
                    group_id: group_id,
                    unit_id: unit_id,
                    code: code
                })
                if (response.success) {
                    response.data.unit.text = response.data.unit.name
                    response.data.type.text = response.data.type.name
                    response.data.group.text = response.data.group.name
                    table.updateRow({id: id, trId: trId}, {
                        name: name,
                        unit: response.data.unit,
                        unit_id: unit_id,
                        type: response.data.type,
                        type_id: type_id,
                        group: response.data.group,
                        group_id: group_id,
                        code: code
                    })
                    tools.toast("success", "Nhóm hàng hóa", "Cập nhật thành công.")
                } else {
                    tools.toast("error", "Nhóm hàng hóa", "Lỗi, vui lòng kiểm tra lại.")
                }
            }
        })

        async function deleteRow(data) {
            const response = await tools.ajaxDelete("/products/" + data.id)
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
            $('#txtCode').val(obj.code)
            $('#txtUnit').attr('data-id', obj.unit.id).val(obj.unit.name)
            $('#txtType').attr('data-id', obj.type.id).val(obj.type.name)
            $('#txtGroup').attr('data-id', obj.group.id).val(obj.group.name)
        }
    }
})

