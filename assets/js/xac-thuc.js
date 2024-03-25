const formDangNhap = $('#form')

if (formDangNhap.find('.sodienthoai').val() !== '') {
    formDangNhap.find('.matkhau').focus()
}
formDangNhap.on('submit', async function (e) {
    tools.loader('#form', true)
    let sodienthoai = $(this).find('.sodienthoai').val()
    let matkhau = $(this).find('.matkhau').val()
    let response = await tools.ajaxPost('/auth/login', {
        phone: sodienthoai,
        password: matkhau
    }, {
        token: false
    })
    if (response.success) {
        tools.loader('#form', false)
        const data = response.data
        localStorage.setItem('info_user', JSON.stringify(data.user))
        localStorage.setItem('access_token', JSON.stringify(data.access_token))
        const urlDefault = '/quan-ly/bang-dieu-khien.html'
        location.href = urlDefault
    } else {
        Swal.fire({
            title: "Đăng nhập thất bại!",
            html: `Vui lòng kiểm tra lại <b class="text-danger">Số điện thoại</b> và <b class="text-danger">Mật khẩu</b>.`,
            icon: "error"
        });
    }
})

$('#modalFormSubmitApiLink').submit(function (e) {
    e.preventDefault()
    const link = $('#txtApiLink').val()
    localStorage.setItem('LinkServer', link)
    $('#modalSetupApiLink').modal('hide')
})
$('#modalSetupApiLink').on('show.bs.modal', function () {
    const link = localStorage.getItem('LinkServer')
    $('#txtApiLink').val(link)
})