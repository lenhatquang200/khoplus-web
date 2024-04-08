$(document).ready(async function () {
    tools.loader('.container-content', true, "Đang lấy dữ liệu...")
    let tableListProduct = []

    let table = tools.table.init({
        id: '#table',
        maxHeight: 250,
        columns: [
            {name: "num", value: "Số", style: {'text-align': 'center', width: '80px'}},
            {name: "name", value: "Hàng hóa"},
            {name: "unit", value: "Đvt", style: {'text-align': 'center', width: '100px'}},
            {name: "price", value: "Giá", align: 'left', style: {'text-align': 'right', width: '100px'}},
            {name: "discount", value: "Giảm giá", align: 'left', style: {'text-align': 'right', width: '100px'}},
            {name: "quantity", value: "Số lượng", align: 'left', style: {'text-align': 'right', width: '100px'}},
            {name: "haveDelivery", value: "G.Hàng", format: "checkOk", style: {'text-align': 'center', width: '80px'}},
        ],
        actions: {
            delete: true,
            edit: false,
            detail: false
        },
        data: tableListProduct,
        handleActions: {
            delete: deleteRow,
        },
    })
    let listProduct = _.isNull(localStorage.getItem('listProduct')) ? [] : JSON.parse(localStorage.getItem('listProduct'))
    setTimeout(async function () {
        const [_listProduct] = await Promise.all([tools.ajaxGet("/products")])
        listProduct = _listProduct.data
        localStorage.setItem('listProduct', JSON.stringify(listProduct))
    }, 100)

    $('#txtProduct').on('input', function () {
        let _listProduct = listProduct
        tools.select('#txtProduct', $(this).val(), _listProduct, id => {
            let data = _listProduct.filter(item => item.id.toString() === id.toString())
            if (data.length) {
                data = data[0]
                $('#txtProduct').attr('data-id', data.id).val(data.name)
            }
        })
    })
    $('#formAddProduct').on('submit', function (e) {
        e.preventDefault()
        let product = $('#txtProduct').attr('data-id')
        let data = listProduct.filter(item => item.id.toString() === product.toString())
        if (data.length) {
            data = data[0]
        }
        let quantity = parseFloat($('#txtQuantity').val())
        addProduct(data, quantity)
        $('#formAddProduct')[0].reset()
        $('#formAddProduct').find('input')[0].focus()
    })

    function addProduct(data, quantity) {
        // { "product": "67", "note": "Optional note 1", "quantity": 1, "discount": 0 }
        // const num = phieu.products.length + 1
        // console.log("num", num)
        let row = {
            num: 1,
            id: data.id,
            name: data.name,
            unit: data.unit.name,
            price: data.price,
            discount: 0,
            quantity: parseFloat(quantity),
            haveDelivery: 0
        }
        table.addRow(row, true)
        updateRowHaveDelivery()
        // phieu.products.push({
        //     num: phieu.products.length + 1,
        //     product: data.id,
        //     note: "",
        //     price: data.price,
        //     discount: 0,
        //     quantity: parseFloat(quantity),
        //     haveDelivery: 0
        // })
    }

    async function deleteRow(data) {
        table.deleteRow(data)
    }

    function updateRowHaveDelivery() {
        $('#table tbody tr td[data-name="haveDelivery"]').on('click', function () {
            const id = $(this).parent().attr('id').split('_')[1]
            const num = $(this).parent().find('td[data-name="num"]').text()
            const data = table.getData()
            data.filter(item => {
                if (item.num.toString() === num.toString()) {
                    let haveDelivery = parseInt(item.haveDelivery) ? 0 : 1
                    table.updateRow({num: num}, {haveDelivery: haveDelivery})
                }
            })
            updateRowHaveDelivery()
        })
    }

    tools.loader('.container-content', false)

    IMask($('#txtInvoiceGiveMoney')[0], {
        mask: 'num',
        blocks: {
            num: {
                // nested masks are available!
                mask: Number,
                thousandsSeparator: ','
            }
        }
    });

})

