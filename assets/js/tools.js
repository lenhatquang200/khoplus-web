const tools = {
    getRamdomStr: function () {
        let length = 5
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result
    },
    getAccessToken: function () {
        let token = localStorage.getItem('access_token')
        token = token.replace(/"/g, '')
        return "Bearer" + ' ' + token
    },
    getUserInfo: function () {
        let user = localStorage.getItem('info_user')
        if (!_.isNull(user) || _.isUndefined(user)) {
            user = JSON.parse(user)
        }
        let current_branch = localStorage.getItem('current_branch')
        if (!_.isNull(current_branch) || _.isUndefined(current_branch)) {
            let data = user.branches.filter(item => item.id.toString() === current_branch.toString())
            if (data.length) {
                data = data[0]
                user.current_branch = {
                    id: data.id,
                    name: data.name
                }
            } else {
                user.current_branch = {
                    id: -1,
                    name: "Kho không xác định"
                }
            }
        } else {
            user.current_branch = {
                id: -1,
                name: "Kho không xác định"
            }
        }
        return user
    },

    ajaxGet: async (url, options) => {
        let isToken = _.isUndefined(options) ? true :
            (_.isUndefined(options.token) ? true : options.token)
        const headers = {
            'Authorization': isToken ? tools.getAccessToken() : '',
            'current-branch': localStorage.getItem('current_branch')
        }
        return await $.ajax({
            url: `${config['apiUrl']}${url}`,
            type: "GET",
            dataType: 'json',
            cache: false,
            headers: headers,
            success: function (data, status, xhr) {
                // alert(data);
            },
            error: function (xhr, status, error) {
            }
        })
    },
    ajaxPost: async (url, data, options) => {
        let isToken = _.isUndefined(options) ? true :
            (_.isUndefined(options.token) ? true : options.token)
        const headers = {
            'Authorization': isToken ? tools.getAccessToken() : '',
            'current-branch': localStorage.getItem('current_branch')
        }
        return await $.ajax({
            url: `${config['apiUrl']}${url}`,
            type: "POST",
            dataType: 'json',
            data: data,
            cache: false,
            headers: headers,
            success: function (data, status, xhr) {

            },
            error: function (xhr, status, error) {
            }
        })
    },
    ajaxDelete: async (url, options) => {
        let isToken = _.isUndefined(options) ? true :
            (_.isUndefined(options.token) ? true : options.token)
        const headers = {
            'Authorization': isToken ? tools.getAccessToken() : '',
            'current-branch': localStorage.getItem('current_branch')
        }
        return await $.ajax({
            url: `${config['apiUrl']}${url}`,
            type: "DELETE",
            dataType: 'json',
            cache: false,
            headers: headers,
            success: function (data, status, xhr) {
                // alert(data);
            },
            error: function (xhr, status, error) {
            }
        })
    },
    ajaxPut: async (url, data, options) => {
        let isToken = _.isUndefined(options) ? true :
            (_.isUndefined(options.token) ? true : options.token)
        const headers = {
            'Authorization': isToken ? tools.getAccessToken() : '',
            'current-branch': localStorage.getItem('current_branch')
        }
        return await $.ajax({
            url: `${config['apiUrl']}${url}`,
            type: "PUT",
            dataType: 'json',
            data: data,
            cache: false,
            headers: headers,
            success: function (data, status, xhr) {

            },
            error: function (xhr, status, error) {
            }
        })
    },

    toast: function (type, title, content) {
        const ramdomIdStr = tools.getRamdomStr()
        const clsRamdom = `toast_${ramdomIdStr}`
        let bgColor = ''
        let txtColor = ''
        if (type === 'success') {
            bgColor = 'bg-success'
            txtColor = 'text-white'
        } else if (type === 'error') {
            bgColor = 'bg-danger'
            txtColor = 'text-white'
        } else if (type === 'warning') {
            bgColor = 'bg-warning'
            txtColor = 'text-white'
        }
        $('#listToast').append(`
        <div class="toast fade show ${clsRamdom}" style="margin-bottom: 10px;">
            <div class="toast-header ${bgColor} ${txtColor}">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btnToast" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${content}
            </div>
        </div>
        `)
        $('#listToast .btnToast').off('click').on('click', function () {
            $(this).parent().parent().remove()
        })
        const autoClose = 5 //5 seconds
        setTimeout(function () {
            $(`#listToast .${clsRamdom}`).remove()
        }, autoClose * 1000)
    },
    select: function (element, keyword, data, callback) {
        keyword = tools.strToSearch(keyword)
        let newData = data.filter(item => tools.strToSearch(JSON.stringify(item)).indexOf(keyword) > -1)
        let items = ``
        newData.map((item, index) => {
            items += `<div class="slcBoxItem" data-id="${item.id}">${item.name}</div>`
        })
        if (newData.length === 0) {
            items += `<div>Không tìm thấy dữ liệu.</div>`
        }
        const len = $(element).parent().find('.slcBoxList').length
        if (len > 0) {
            $(element).parent().find('.slcBoxList').html(items)
        } else {
            $(element).after(`
            <div class="slcBoxList" style="width: 100%; border: 1px solid rgba(0,0,0,.2); border-radius: 3px; padding: 10px; max-height: 200px; overflow-y: scroll; margin-top: 5px; position: absolute; z-index: 999999; background-color: #f0f8ff;">
                ${items}
            </div>`)
        }
        $($(element).parent().find('.slcBoxItem')[0]).addClass('selected')
        $(element).parent().find('.slcBoxItem').off('click').on('click', function () {
            let value = $(this).attr('data-id')
            $(element).parent().find('.slcBoxList').remove()
            callback(value)
        })
        $(element).off('keypress').on('keypress', function (e) {
            if (e.keyCode === 13) {
                let value = $(element).parent().find('.selected').attr('data-id')
                $(element).parent().find('.slcBoxList').remove()
                callback(value)
            }
        })
        let scroll = 0
        let height = $($(element).parent().find('.slcBoxItem')[0]).addClass('selected').height() + 8
        $(element).off('keyup').on('keyup', function (e) {
            if (e.keyCode === 40) {
                let index = $(element).parent().find('.selected').index() + 1
                index = index > $(element).parent().find('.slcBoxItem').length - 1 ? 0 : index
                $(element).parent().find('.slcBoxItem').removeClass('selected')
                $($(element).parent().find('.slcBoxItem')[index]).addClass('selected')

                $(element).parent().find('.slcBoxList').animate({
                    scrollTop: index * height
                }, 200)
            }
            if (e.keyCode === 38) {
                let index = $(element).parent().find('.selected').index() - 1
                index = index < 0 ? $(element).parent().find('.slcBoxItem').length - 1 : index
                $(element).parent().find('.slcBoxItem').removeClass('selected')
                $($(element).parent().find('.slcBoxItem')[index]).addClass('selected')

                $(element).parent().find('.slcBoxList').animate({
                    scrollTop: index * height
                }, 200)
            }
        })
    },
    loader: function (element, isRun) {
        if (isRun) {
            $(element).css('position', 'relative').append(`
            <div id="loader">
                <div class="loading"></div>
            </div>
            `)
        } else {
            $('#loader').remove()
        }
    },

    timeSpanToDateTime: (time) => {
        try {
            let da = new Date(time)
            let y = da.getFullYear()
            let m = ('0' + (da.getMonth() + 1)).slice(-2)
            let d = ('0' + da.getDate()).slice(-2)
            let h = ('0' + da.getHours()).slice(-2)
            let i = ('0' + da.getMinutes()).slice(-2)
            let s = ('0' + da.getSeconds()).slice(-2)
            return `${d}/${m}/${y} ${h}:${i}:${s}`
        } catch (e) {
            return e.toString()
        }
    },
    getNowDateTime: () => {
        const time = new Date().getTime()
        return tools.timeSpanToDateTime(time)
    },
    boDauTiengViet: function (str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    },
    strToSearch(value) {
        return tools
            .boDauTiengViet(value)
            .toLowerCase()
            .replace(/,/g, "")
            .replace(/ /g, "");
    },
    strUpperFirstChar: function (str) {
        if (str === "" || typeof str === "undefined" || typeof str === null) {
            return "";
        }
        str = str.toLowerCase();
        str = str.split(' ');
        str = str.map(item => {
            let firstChar = item.charAt(0).toUpperCase();
            item = firstChar + item.substring(1);
            return item;
        });
        return str.join(' ');
    },
    ExportExcel: function (DOMTable, filename, options = {}) {
        let removeColumnEnd = _.isUndefined(options.remove_column_end) ? false : options.remove_column_end;
        let tbody = '';
        DOMTable.find('tbody').find('tr').map(function (i) {
            let $this = $(this);
            let tds = [];
            let n = $this.find('td').length;
            $this.find('td').map(function (i, value) {
                if (removeColumnEnd) {
                    if (i < n - 1) {
                        tds.push(value.outerHTML.replace(/\./g, ''));
                    }
                } else {
                    if (value.outerHTML.indexOf(`data-isfloat="true"`)) {
                        tds.push(value.outerHTML);
                    } else {
                        tds.push(value.outerHTML.replace(/\./g, ''));
                    }
                }
            });
            tbody += `<tr>${tds.join('')}</tr>`;
        });
        tbody = `<tbody>${tbody}</tbody>`;
        let table = DOMTable.html();
        let thead = table.substr(0, table.lastIndexOf('</thead>')) + '</thead>';
        thead = thead.replace('<th style="width: 40px;"></th>', '');
        table = table.replace(/\./g, '');
        table = table.replace(/<td>0/g, "<td>'0");
        table = `<table>${thead} ${tbody}</table>`;

        table = $(table)[0];
        const wb = XLSX.utils.table_to_book(table);
        let sheetname = `${filename} (${tools.getNowDateTime()})`;
        sheetname = sheetname.replace(/\n/g, '').replace(/  /g, '').replace(/\s{2,}/g, ' ');
        sheetname = tools.strUpperFirstChar(sheetname);
        XLSX.writeFile(wb, sheetname + ".xlsx");
    },
    table: {
        init: (_in) => {
            _in.rootData = _in.data
            let tableShowRows = localStorage.getItem('tableShowRows')
            tableShowRows = _.isNull(tableShowRows) ? 10 : parseInt(tableShowRows)
            _in.pageLimit = tableShowRows === 0 ? _in.data.length : tableShowRows
            _in.pageTotal = () => {
                if (_in.pageLimit === 0) {
                    return 1
                }
                return _in.data.length % _in.pageLimit === 0 ?
                    _in.data.length / _in.pageLimit :
                    parseInt(_in.data.length / _in.pageLimit) + 1
            }
            _in.pageCurrent = 1
            _in = tools.table._renderThead(_in)
            _in = tools.table._renderPagination(_in)
            return {
                addRow: (row, addToTop) => {
                    if (addToTop) {
                        _in.data.unshift(row)
                        _in.pageCurrent = 1
                    } else {
                        _in.data.push(row)
                        _in.pageCurrent = _in.pageTotal()
                    }
                    let num = 1
                    _in.rootData = _in.rootData.map(item => {
                        item.num = num++
                        return item
                    })
                    _in.data = _in.rootData
                    tools.table._renderTbody(_in)
                    tools.table.__updateText(_in)
                },
                deleteRow: (data) => {
                    _in.rootData = _in.rootData.filter(item => item.id.toString() !== data.id.toString())
                    let num = 1
                    _in.rootData = _in.rootData.map(item => {
                        item.num = num++
                        return item
                    })
                    _in.data = _in.rootData
                    tools.table._renderTbody(_in)
                    tools.table.__updateText(_in)
                    $(`#${data.trId}`).remove()
                },
                updateRow: (data, obj) => {
                    _in.rootData = _in.rootData.filter(item => {
                        if (item.id.toString() === data.id.toString()) {
                            Object.keys(item).map(k => {
                                if (!_.isUndefined(obj[k])) {
                                    item[k] = obj[k]
                                }
                            })
                        }
                        return item
                    })
                    let num = 1
                    _in.rootData = _in.rootData.map(item => {
                        item.num = num++
                        return item
                    })
                    _in.data = _in.rootData
                    tools.table._renderTbody(_in)
                    tools.table.__updateText(_in)
                }
            }
        },
        __updateText: (_in) => {
            $(_in.id).find('.pagination .page-current').text(_in.pageCurrent)
            $(_in.id).find('.pagination .page-link-input').val(_in.pageCurrent)
            $(_in.id).find('.pagination .page-total').text(_in.pageTotal())
        },
        __makeStyle: (obj) => {
            if (_.isUndefined(obj)) {
                return ""
            }
            let styles = []
            Object.keys(obj).map(key => {
                let v = obj[key]
                let k = key
                styles.push(`${k}: ${v};`)
            })
            return styles.length ? ` style="${styles.join(' ')}"` : ''
        },
        _renderPagination: (_in) => {
            let paginationLi = `
            <ul class="pagination">
                <li class="page-item disabled">
                    <a class="page-link" href="javascript:void(0)">
                        Bạn đang ở trang <span class="page-current">-</span>/<span class="page-total">-</span>  
                    </a>
                </li>
                <li class="page-item">
                    <div style="display: flex;">
                        <select class="form-select slc-table-showRows">
                          <option value="5">5 dòng</option>
                          <option selected value="10">10 dòng</option>
                          <option value="20">20 dòng</option>
                          <option value="50">50 dòng</option>
                          <option value="0">Tất cả</option>
                        </select>
                    </div>
                </li>
                <li class="pagination-click page-item">
                    <a data-type="prev" class="page-link" href="javascript:void(0)">Trước</a>
                </li>
                <li class="pagination-click page-item">
                    <input placeholder="Trang" value="" type="number" class="form-control page-link-input" style="width: 100px; text-align: center;">
                </li>
                <li class="pagination-click page-item">
                    <a data-type="next" class="page-link" href="javascript:void(0)">Sau</a>
                </li>
            </ul>`
            $(_in.id).find('.paginator').html(paginationLi)
            tools.table.__updateText(_in)
            let valueSLCTableShowRows = _in.pageLimit === _in.data.length ? 0 : _in.pageLimit
            $(_in.id).find('.pagination .slc-table-showRows').val(valueSLCTableShowRows).on('change', e => {
                let value = parseInt(e.target.value)
                localStorage.setItem('tableShowRows', value)
                _in.pageCurrent = 1
                _in.pageLimit = value === 0 ? _in.data.length : value
                tools.table._renderTbody(_in)
                tools.table.__updateText(_in)
            })
            $(_in.id).find('.pagination .page-link').on('click', function () {
                let _this = $(this)
                let type = _this.attr('data-type')
                if (type === "prev") {
                    _in.pageCurrent = parseInt(_in.pageCurrent) - 1
                    _in.pageCurrent = _in.pageCurrent <= 0 ? 1 : _in.pageCurrent
                } else if (type === "next") {
                    _in.pageCurrent = parseInt(_in.pageCurrent) + 1
                    _in.pageCurrent = _in.pageCurrent >= _in.pageTotal() ? _in.pageTotal() : _in.pageCurrent
                }
                tools.table.__updateText(_in)
                tools.table._renderTbody(_in)
            });
            $(_in.id).find('.pagination .page-link-input').on('keyup', e => {
                if (e.keyCode === 13) {
                    let page = parseInt(e.target.value)
                    if (page <= 0 || page > _in.pageTotal()) {
                        Swal.fire({
                            title: "Không hợp lệ!",
                            html: `Số trang không hợp lệ, vui lòng nhập lại.`,
                            icon: "error"
                        });
                        return
                    }
                    _in.pageCurrent = page
                    let num = 1
                    _in.rootData = _in.rootData.map(item => {
                        item.num = num++
                        return item
                    })
                    _in.data = _in.rootData
                    tools.table._renderTbody(_in)
                    tools.table.__updateText(_in)
                }
            })
            tools.table._renderTbody(_in)
            return _in
        },
        _renderTbody: (_in) => {
            let indexCols = {}
            _in.columns.map(item => {
                indexCols[item['name']] = {
                    value: item['value'],
                    style: item['style'],
                    format: item['format']
                }
            })
            const data = _in.data
            const startIndex = (_in.pageCurrent * _in.pageLimit) - _in.pageLimit
            const endIndex = _in.pageLimit * _in.pageCurrent
            const _renderTD = (obj) => {
                if (_.isUndefined(obj)) {
                    return ""
                }
                let tds = ``
                Object.keys(obj).map(key => {
                    if (!_.isUndefined(indexCols[key])) {
                        let style = tools.table.__makeStyle(indexCols[key]['style'])
                        let v = obj[key]
                        if (_.isObject(v)) {
                            v = v.text
                        }
                        if (!_.isUndefined(indexCols[key]['format'])) {
                            if (indexCols[key]['format'] === 'datetime') {
                                v = tools.timeSpanToDateTime(v)
                            }
                        }
                        tds += `<td${style} data-name="${key}">${_.isNull(v) ? "" : v}</td>`
                    }
                })
                if (_in.actions) {
                    let btns = ``
                    let haveActions = 0
                    if (_in.actions.delete) {
                        haveActions++
                        btns = `<a data-type="delete" data-id="${obj.id}" class="tableRowActions" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" title="Xóa""><i class="bi bi-trash3 text-danger"></i></a>`
                    }
                    if (_in.actions.edit) {
                        haveActions++
                        btns += `<span style="margin-left: 10px"></span><a data-type="edit" data-id="${obj.id}" class="tableRowActions" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" title="Chỉnh sửa"><i class="bi bi-pencil-square text-info"></i></a>`
                    }
                    if (_in.actions.detail) {
                        haveActions++
                        btns += `<span style="margin-left: 10px"></span><a data-type="detail" data-id="${obj.id}" class="tableRowActions" href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" title="Chi tiết"><i class="bi bi-info-circle text-dark"></i></a>`
                    }
                    if (haveActions > 0) {
                        tds = tds + `<td style="text-align: center;">${btns}</td>`
                    }
                }
                return tds
            }
            let trs = ``
            for (let i = startIndex; i < endIndex; i++) {
                let row = data[i]
                if (row) {
                    const ramdomIDStr = tools.getRamdomStr()
                    trs += `<tr id="${ramdomIDStr}_${row.id}">${_renderTD(row)}</tr>`
                }
            }
            $(_in.id).find('tbody').html(trs)
            $(_in.id).find('.tableRowActions').off('click').on('click', function (e) {
                const id = $(this).attr('data-id')
                const trtId = $(this).parent().parent().attr('id')
                const type = $(this).attr('data-type')
                if (_in['handleActions'])
                    if (_in['handleActions'][type])
                        _in['handleActions'][type]({
                            id: id,
                            trId: trtId
                        }, _in)
            })
        },
        _renderThead: (_in) => {
            let haveActions = 0
            if (_in.actions) {
                Object.keys(_in.actions).map(key => {
                    if (_in.actions[key]) {
                        haveActions++
                    }
                })
            }
            let thead = ``
            _in.columns.map(item => {
                let styles = []
                if (item.align) {
                    styles.push(`text-align: ${item.align}`)
                }
                const strStyle = styles.length ? ` style="${styles.join(';')}"` : ''
                thead += `<th${strStyle}>${item['value']}</th>`
            })
            if (haveActions > 0) {
                thead += `<th style="width: 100px;"></th>`
            }
            let tableHTML = `
            <div>
                <div style="display: flex; justify-content: space-between;">
                    <div style="position: relative;">
                        <div style="display: flex">
                            <input placeholder="Tìm kiếm..." style="width: 350px;" type="text" class="form-control input-search">
                            <button type="button" class="btn btn-outline-primary">Xuất Excel</button>
                        </div>
                        <div class="input-search-info" style="position: absolute; padding-top: 1px; font-size: 10px;"></div>
                    </div>
                    <div style="display: flex; justify-content: flex-end">
                        <div class="paginator"></div>
                    </div>
                </div>
                <table class="table table-hover table-bordered">
                    <thead class="table-success">${thead}</thead>
                    <tbody></tbody>
                </table>
                <style>
                    .page-link{
                        color: #000;
                    }
                    .page-item.active .page-link{
                        background-color: #d1e7dd;
                        border-color: #d1e7dd;
                        color: #000;
                    }
                </style>
            </div>
            `
            _in.DOM = $(_in.id).html(tableHTML)
            $(_in.id).find('.input-search').on('input', function (e) {
                let value = tools.strToSearch(e.target.value)
                const colsSearch = _in.colsSearch.join('')
                let newData = _in.rootData.filter(obj => {
                    let str = ''
                    Object.keys(obj).map(key => {
                        if (colsSearch.indexOf(key) > -1) {
                            str += JSON.stringify(obj[key])
                        }
                    })
                    return tools.strToSearch(str).indexOf(value) > -1
                })
                if (value === '') {
                    newData = _in.rootData
                    $(_in.id).find('.input-search-info').text(``)
                } else {
                    $(_in.id).find('.input-search-info').text(`Tìm thấy ${newData.length} kết quả`)
                }
                _in.data = newData
                _in.pageCurrent = 1
                tools.table._renderTbody(_in)
                tools.table.__updateText(_in)
            })
            $(_in.id).find('.btn-outline-primary').on('click', function (e) {
                let DOMTable = $(_in.id).find('.table')
                let title = $('title').text().toUpperCase()
                tools.ExportExcel(DOMTable, title, {
                    remove_column_end: false,
                });
            })
            return _in
        }
    }
}