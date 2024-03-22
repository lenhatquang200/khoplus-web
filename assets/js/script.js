const listMenu = [
    {name: "Bảng điều khiển", url: "/quan-ly/bang-dieu-khien.html", submenu: []},
    {
        name: "Danh mục",
        url: "#",
        submenu: [
            {
                name: "Hàng hóa", url: "#", submenu: [
                    {name: "Danh sách", url: "/quan-ly/hang-hoa/danh-sach.html"},
                    {name: "Loại", url: "/quan-ly/hang-hoa/loai.html"},
                    {name: "Nhóm", url: "/quan-ly/hang-hoa/nhom.html"},
                    {name: "Đơn vị tính", url: "/quan-ly/hang-hoa/don-vi-tinh.html"},
                ]
            },
            {
                name: "Nhà cung cấp", url: "#", submenu: [
                    {name: "Danh sách", url: "/quan-ly/nha-cung-cap/danh-sach.html"},
                    {name: "Nhóm", url: "/quan-ly/nha-cung-cap/nhom.html"},
                ]
            },
            {name: "Cây trồng", url: "/quan-ly/cay-trong.html", submenu: []},
        ]
    },
]

const denyPathname = ['/', '/index.html']
const txtHomNay = () => {
    const currentPathname = location.pathname
    let b = false
    denyPathname.filter(item => {
        if (!b) {
            if (currentPathname === item) {
                b = true
            }
        }
    })
    if (b) {
        return
    }
    let date = new Date()
    let days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    let dayOfWeek = days[date.getDay()];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    let userInfo = tools.getUserInfo()
    const txt = `
    Xin chào <b>${userInfo.name}</b>, bạn đang ở <b>${userInfo.current_branche.name}</b>.
    Hôm nay là <b>${dayOfWeek}</b>, Ngày <b>${day}</b> Tháng <b>${month}</b> Năm <b>${year}</b>
    `;
    if ($('#txtHomNay').length) {
        $('#txtHomNay').html(txt)
    } else {
        $('body').prepend(`<div style="font-style: italic;" class="text-center mt-1 mb-1" id="txtHomNay">${txt}</div>`)
    }
}
const menu = () => {
    const currentPathname = location.pathname
    let b = false
    denyPathname.filter(item => {
        if (!b) {
            if (currentPathname === item) {
                b = true
            }
        }
    })
    if (b) {
        return
    }
    const userInfo = tools.getUserInfo()
    const list = listMenu
    let li = ``
    list.map(item => {
        let name = item['name']
        let isSub = !_.isUndefined(item['submenu']) ? item['submenu'].length > 0 : false
        if (isSub) {
            let name1 = ''
            let level_1 = ``
            item['submenu'].map(item => {
                name1 = item['name']
                let isSub = !_.isUndefined(item['submenu']) ? item['submenu'].length > 0 : false
                if (isSub) {
                    let name2 = ''
                    let level_2 = ``
                    item['submenu'].map(item => {
                        name2 = item['name']
                        let isSub = !_.isUndefined(item['submenu']) ? item['submenu'].length > 0 : false
                        if (isSub) {
                            let name3 = item['name']
                            let level_3 = ``
                            item['submenu'].map(item => {
                                level_3 += `<li data-url="${item['url']}" data-name="${name}@${name1}@${name2}@${name3}"><a class="dropdown-item" href="${item['url']}">${item['name']}</a></li>`
                            })
                            level_2 += `
                            <li class="dropdown-submenu">
                                <a class="dropdown-item test" href="#">
                                    ${item['name']} <i class="bi bi-caret-right float-end"></i>
                                </a >
                                <ul class="dropdown-menu">
                                    ${level_3}
                                 </ul>
                            </li>
                            `
                        } else {
                            level_2 += `<li data-url="${item['url']}" data-name="${name}@${name1}@${name2}"><a class="dropdown-item" tabindex="-1" href="${item['url']}">${item['name']}</a></li>`
                        }
                    })
                    level_1 += `
                    <li class="dropdown-submenu">
                        <a class="dropdown-item test" tabindex="-1" href="#">
                            ${item['name']} <i class="bi bi-caret-right float-end"></i>
                        </a>
                        <ul class="dropdown-menu">
                            ${level_2}
                        </ul>
                    </li>
                    `
                } else {
                    level_1 += `<li data-url="${item['url']}" data-name="${name}@${name1}"><a class="dropdown-item" tabindex="-1" href="${item['url']}">${item['name']}</a></li>`
                }
            })
            li += `
            <li class="nav-item dropdown">
                <a class="nav-link nav-link-style" href="#" role="button" data-bs-toggle="dropdown">
                    ${item['name']}
                    <i class="bi bi-caret-down"></i>
                </a>
                <ul class="dropdown-menu">
                    ${level_1}
                </ul>
            </li>
            `
        } else {
            li += `
            <li data-name="${name}" data-url="${item['url']}" class="nav-item">
              <a class="nav-link nav-link-style" href="${item['url']}">${item['name']}</a>
            </li>
            `
        }
    })
    $('body').prepend(`
    <nav class="navbar navbar-expand-sm bg-white navbar-light"
         style="border-top: 2px solid #0ac282;border-bottom: 2px solid #0ac282">
         <div style="position:relative; padding-left: 5px; padding-right: 0; margin: 0;">
            <a class="navbar-brand" href="#" style="margin: 0;">
                <img src="/assets/images/logo.png" style="width: 40px;">
            </a>
        </div>
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav">
                    ${li}
                </ul>
            </div>
            <div style="position: relative">
                <a style="padding: 0;" class="nav-link nav-link-style" href="#" role="button" data-bs-toggle="dropdown">
                    <img src="/assets/images/user_default.png" alt="Avatar Logo" style="width: 40px;"
                         class="rounded-pill">
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a id="btnUserInfo" class="dropdown-item" href="javascript:void(0)">Thông tin</a></li>
                    <li><a data-bs-toggle="modal" data-bs-target="#modalChangeBranches" class="dropdown-item" href="javascript:void(0)">Đổi kho hàng</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a id="btnLogout" class="dropdown-item text-danger" href="javascript:void(0)">Thoát</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="modalChangeBranches" data-bs-keyboard="false" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
    
                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">ĐỔI KHO HÀNG</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
    
                    <!-- Modal body -->
                    <div class="modal-body">
                        
                    </div>
    
                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btnClose" data-bs-dismiss="modal"><i
                                class="bi bi-x-lg"></i> Đóng
                        </button>
                        <button type="submit" class="btn btn-success btnSave"><i class="bi bi-floppy"></i> Lưu</button>
                    </div>
    
                </div>
            </div>
        </div>
    `)
    $('#collapsibleNavbar ul li').on('click', function () {
        if (!_.isUndefined($(this).attr('data-name')))
            localStorage.setItem("MenuClickName", $(this).attr('data-name').replace(/@/g, '_'))
        localStorage.setItem("MenuClickUrl", $(this).attr('data-url'))
    })
    $('#modalChangeBranches').on('show.bs.modal', function (e) {
        const userInfo = tools.getUserInfo()
        let opts = ``
        userInfo.branches.map(item => {
            opts += `
            <div class="form-check">
                <label class="form-check-label" for="opts_branches_${item.id}">
                    <input${item.id.toString() === userInfo.current_branche.id.toString() ? " checked" : ""} type="radio" class="form-check-input opts_branches" id="opts_branches_${item.id}" name="optradio" value="${item.id}">${item.name}
                </label>
            </div>
            `
        })
        $('#modalChangeBranches .modal-body').html(opts)
        $('#modalChangeBranches .btnSave').off('click').on('click', function () {
            $('#modalChangeBranches .opts_branches').map(function () {
                if ($(this).prop('checked')) {
                    localStorage.setItem('current_branche', $(this).attr('value'))
                    txtHomNay()
                    tools.toast("success", "Đổi kho hàng", "Cập nhật thành công.")
                    $('#modalChangeBranches').modal('hide');
                }
            })
        })
    })
    $('body .container-fluid').css('position', 'relative')
}
const breadcrumb = () => {
    const currentPathname = location.pathname
    let b = false
    denyPathname.filter(item => {
        if (!b) {
            if (currentPathname === item) {
                b = true
            }
        }
    })
    if (b) {
        return
    }
    let menuClickName = localStorage.getItem('MenuClickName')
    menuClickName = _.isNull(menuClickName) ? "" : menuClickName
    let li = ``
    menuClickName.split('_').map(item => {
        li += `<li class="breadcrumb-item">${item}</li>`
    })
    let html = `
    <div class="container-fluid mt-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                ${li}
            </ol>
        </nav>
    </div>
    `
    $('body').prepend(html)
}

$('input').attr('autocomplete', 'off')
$('input').on('input', function () {
    let $this = $(this)
    let idElement = $this.attr('id')
    let rememberValue = parseInt($this.attr('rememberValue')) === 1
    if (rememberValue) {
        localStorage.setItem(idElement, $this.val())
    }
})
$('input').map(function () {
    let $this = $(this)
    let idElement = $this.attr('id')
    let valueElement = localStorage.getItem(idElement)
    let rememberValue = parseInt($this.attr('rememberValue')) === 1
    if (rememberValue) {
        $(`#${idElement}`).val(valueElement)
    }
})
$('form').on('submit', function (e) {
    e.preventDefault()
})
$('.modal').on('shown.bs.modal', () => {
    $('.modal').find('[autofocus]').focus()
})
$('.modal').on('hide.bs.modal', (e) => {
    $(e.target).find('input').map(function () {
        $(this).val('')
    })
})

document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        let menuClickName = localStorage.getItem('MenuClickName')
        menuClickName = _.isNull(menuClickName) ? "" : menuClickName.toUpperCase()
        if (menuClickName !== "") $('title').text(menuClickName)
        breadcrumb()
        menu()
        txtHomNay()
        $('#btnLogout').on('click', function () {
            localStorage.removeItem('info_user')
            localStorage.removeItem('access_token')
            location.href = '/'
        })
        $('#btnUserInfo').on('click', function () {
            location.href = '/thong-tin-nguoi-dung.html'
            localStorage.setItem("MenuClickName", "Thông tin người dùng")
            localStorage.setItem("MenuClickUrl", "/thong-tin-nguoi-dung.html")
        })
        $('.dropdown-submenu a.test').on("click", function (e) {
            $(this).parent().parent().find('ul.dropdown-menu').css('display', 'none')
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
        });
        $('body').append(`<div id="listToast" style="position: fixed; top: 10px; right: 10px; z-index: 99999999"></div>`)
    } else {
        document.querySelector("body").style.visibility = "visible";
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
};