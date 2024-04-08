$(document).ready(async function () {
    tools.loader('.container-content', true, "Đang lấy dữ liệu...")
    let listManufacturing = await tools.ajaxGet("/manufacturings")
    let listManufacturingGroup = await tools.ajaxGet("/manufacturing-groups")
    if (listManufacturing.success) {
        $('#txtGroup').on('input', function () {
            let _listGroup = listManufacturingGroup.data
            tools.select('#txtGroup', $(this).val(), _listGroup, id => {
                let data = _listGroup.filter(item => item.id.toString() === id.toString())
                if (data.length) {
                    data = data[0]
                    $('#txtGroup').attr('data-id', data.id).val(data.name)
                }
            })
        })
        const list = []
        let num = 1
        listManufacturing.data.map(item => {
            // console.log(item.manufacturing_group ?? item.manufacturing_group.name)
            if (!_.isNull(item.manufacturing_group)) {
                item.manufacturing_group.text = _.isNull(item.manufacturing_group) ? "" : item.manufacturing_group.name
            } else {
                item.manufacturing_group = {
                    text: ""
                }
            }
            list.push({
                num: num++,
                id: item.id,
                code: item.code,
                manufacturing_group: item.manufacturing_group,
                name: item.name,
                phone: item.phone,
                address: item.address,
                account_number: item.account_number,
                bank_name: item.bank_name,
                note: item.note,
                formatted_created_at: item.formatted_created_at
            })
        })
        let table = tools.table.init({
            id: '#table',
            maxHeight: 500,
            columns: [
                {name: "num", value: "Số", align: 'center', style: {'text-align': 'center', width: '80px'}},
                {name: "code", value: "Mã"},
                {name: "manufacturing_group", value: "Nhóm"},
                {name: "name", value: "Tên"},
                {name: "phone", value: "Số điện thoại"},
                {name: "address", value: "Địa chỉ"},
                {name: "account_number", value: "STK Ngân hàng"},
                {name: "bank_name", value: "Ngân hàng"},
                {name: "note", value: "Ghi chú"},
                {name: "formatted_created_at", value: "TG Tạo", style: {width: '200px'}},
            ],
            colsSearch: ['name', 'code', 'manufacturing_group', 'phone', 'address', 'account_number', 'bank_name', 'note'],
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
                $('#modalFormSubmit')[0].reset()
                $('#txtGroup').attr('data-id', '').focus()
                $('#txtCode').val(new Date().getTime())
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
                let code = $("#txtCode").val()
                let name = $("#txtName").val()
                let phone = $("#txtPhone").val()
                let address = $("#txtAddress").val()
                let note = $("#txtNote").val()
                let manufacturing_group_id = $("#txtGroup").attr('data-id')
                let account_number = $("#txtAccountNumber").val()
                let bank_name = $("#txtBankName").val()
                if (type) {
                    const response = await tools.ajaxPost("/manufacturings", {
                        code: code,
                        name: name,
                        phone: phone,
                        address: address,
                        note: note,
                        account_number: account_number,
                        bank_name: bank_name,
                        manufacturing_group_id: manufacturing_group_id,
                    })
                    if (response.success) {
                        $('#modalFormSubmit')[0].reset()
                        $('#txtGroup').attr('data-id', '').focus()
                        $('#txtCode').val(new Date().getTime())
                        $('#txtName')
                            .attr('data-trid', '')
                            .attr('data-id', '')
                        response.data.manufacturing_group.text = response.data.manufacturing_group.name
                        response.data.num = list.length + 1
                        let row = {
                            num: list.length + 1,
                            id: response.data.id,
                            code: response.data.code,
                            manufacturing_group: response.data.manufacturing_group,
                            name: response.data.name,
                            phone: response.data.phone,
                            address: response.data.address,
                            account_number: response.data.account_number,
                            bank_name: response.data.bank_name,
                            note: response.data.note,
                            formatted_created_at: response.data.formatted_created_at
                        }
                        table.addRow(row)
                        tools.toast("success", "Nhóm nhà cung cấp", "Tạo mới thành công.")
                    } else {
                        tools.toast("error", "Nhóm nhà cung cấp", "Lỗi, vui lòng kiểm tra lại.")
                    }
                } else {
                    //update row
                    const trId = $("#txtName").attr('data-trid')
                    const id = $("#txtName").attr('data-id')
                    const num = $("#txtName").attr('data-num')
                    const data = {
                        code: code,
                        name: name,
                        phone: phone,
                        address: address,
                        note: note,
                        account_number: account_number,
                        bank_name: bank_name,
                        manufacturing_group_id: manufacturing_group_id
                    }
                    const response = await tools.ajaxPut("/manufacturings/" + id, data)
                    if (response.success) {
                        response.data.manufacturing_group.text = response.data.manufacturing_group.name
                        data.manufacturing_group = response.data.manufacturing_group
                        table.updateRow({id: id, trId: trId, num: num}, data)
                        tools.toast("success", "Nhóm nhà cung cấp", "Cập nhật thành công.")
                    } else {
                        tools.toast("error", "Nhóm nhà cung cấp", "Lỗi, vui lòng kiểm tra lại.")
                    }
                }
            }
        )

        async function deleteRow(data) {
            const response = await tools.ajaxDelete("/manufacturings/" + data.id)
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
                .attr('data-num', obj.num)
                .val(obj.name)
            $('#txtCode').val(obj.code)
            $('#txtPhone').val(obj.phone)
            $('#txtAddress').val(obj.address)
            $('#txtNote').val(obj.note)
            $('#txtAccountNumber').val(obj.account_number)
            $('#txtBankName').val(obj.bank_name)
            $('#txtGroup').attr('data-id', obj.manufacturing_group.id).val(obj.manufacturing_group.name)
        }
    }

    IMask($('#txtPhone')[0], {mask: "0000-000-000"});
    tools.loader('.container-content', false)
})

