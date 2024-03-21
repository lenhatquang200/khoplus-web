const formDangNhap = $('#form')

if (formDangNhap.find('.sodienthoai').val() !== '') {
    formDangNhap.find('.matkhau').focus()
}
formDangNhap.on('submit', async function (e) {
    let sodienthoai = $(this).find('.sodienthoai').val()
    let matkhau = $(this).find('.matkhau').val()
    let response = await tools.ajaxPost('/auth/login', {
        phone: sodienthoai,
        password: matkhau
    }, {
        token: false
    })
    if (response.success) {
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