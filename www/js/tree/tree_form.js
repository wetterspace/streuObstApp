/* globals PflegeForm, ImageUploader, ObstFormHelper, Form, Obst, QrCodeHelper, CordovaCamera, NavbarHelper, TreeAttr, google */

var TreeForm = function (tree, wiese) {
    // wenn man kein baum sondern ne extra sache anlegt;
    if (wiese) {
        this.wiese = wiese;
    }

    this.create_edit_extra = false;

    // wenn lon lat bereits von karte übergeben wird;
    this.lon = null;
    this.lat = null;

    this.icon_list = [
        1454539554736,
        1453661192359,
        1454538919629,
        1454539003614,
        1454539501994
    ];


    // wenn man einen Tree übergibt wird dieser bearbeitet, wenn keiner dann wird ein neuer erstellt
    if (tree) {
        this.tree = tree;
        this.wiese = tree.wiese;

        // handels pflegezustaende
        if (tree.is_extra()) {
            this.create_edit_extra = true;
        } else {
            this.pflegeform = new PflegeForm(tree);
        }
    } else {
        this.pflegeform = new PflegeForm();
    }

    this.image_uploader = new ImageUploader();

    this.obst_form_helper = new ObstFormHelper(this.wiese.obstarten);

    var obst_form = this.obst_form_helper;
    var obstsorten = this.wiese.obstarten;

    this.form_rows = [
        // row 1
        // Baum ID

        // TreeAttr stands for Tree Attributes
        {
            id: 'tree_form_row_1',
            fields: [
                {
                    id: TreeAttr.name.id,
                    form: Form.Text,
                    title: TreeAttr.name.title,
                    extra: true
                },
                {
                    id: TreeAttr.obstart.id,
                    form: Form.Dropdown,
                    options: Obst.getArten(obstsorten),
                    // when another value gets selected
                    onchange: function (val) {
                        obst_form.change_sorten_dropdown(val);
                    },
                    title: TreeAttr.obstart.title
                },

                {
                    id: TreeAttr.sortname.id,
                    form: Form.Dropdown,
                    options: [],
                    on_append: function () {
                        obst_form.change_sorten_dropdown($('#' + TreeAttr.obstart.id).val());
                    },
                    title: TreeAttr.sortname.title
                },

                {
                    id: TreeAttr.lon.id,
                    form: Form.Text,
                    title: TreeAttr.lon.title,
                    validation: TreeAttr.lon.validation,
                    extra: true
                },

                {
                    id: TreeAttr.lat.id,
                    form: Form.Text,
                    title: TreeAttr.lat.title,
                    validation: TreeAttr.lat.validation,
                    extra: true
                }
            ]
        }, {
            id: 'tree_form_row_1_2',
            fields: [
                {
                    id: TreeAttr.ploid.id,
                    form: Form.Dropdown,
                    options: ['Diploid', 'Tripolid'],
                    title: TreeAttr.ploid.title
                },

                {
                    id: TreeAttr.gepflanzt_date.id,
                    form: Form.Date,
                    title: TreeAttr.gepflanzt_date.title
                },
                {
                    id: TreeAttr.anmerkungen.id,
                    form: Form.Textarea,
                    rows: 5,
                    title: TreeAttr.anmerkungen.title,
                    extra: true
                }
            ]
        }, {
            // Pflegezustände hat eigene Form
            id: 'tree_form_row_2',
            func: function () {
                if (this.create_edit_extra == false) {
                    this.pflegeform.render($('#tree_form_row_2'));
                }
            }.bind(this)
        }

    ];
};

TreeForm.prototype.set_extra_anlegen = function () {
  // wenn man kein baum sondern ne extra sache anlegt;
    this.create_edit_extra = true;
};

TreeForm.prototype.get_extra_icon_image_id = function () {
    return $('.icon_selected_img').first().data('image_id');
};

TreeForm.prototype.set_lon_lat = function (lon, lat) {
  // lon lat wird von drag übergeben
  // in wiese show.html
    this.lon = lon;
    this.lat = lat;
};

TreeForm.prototype.add_icon_id = function (image_id) {
  // falls noch nicht in icon array
    if ($.inArray(image_id, this.icon_list) < 0) {
        console.log(image_id);
        console.log(this.icon_list);
        this.icon_list.unshift(image_id);
    }
    this.render_icon_list(image_id);
};

TreeForm.prototype.render_icon_list = function (opt_image_id) {
    var icon_box = $('#icon_list');
    icon_box.html('');

    this.icon_list.forEach(function (icon_id) {
        var img_element = $('<img/>', { src: ImageHelper.get_url(icon_id),
      'data-image_id': icon_id,
      style: 'width:100%;height:auto; margin-top:5px; margin-bottom: 5px',
      class: 'img-thumbnail icon_auswahl_img' });

        icon_box.append($('<div/>', { class: 'col-xs-4' }).append(img_element));

        ImageHelper.get_image_data_for(icon_id, img_element, { save: false });
    }.bind(this));

    $('.icon_auswahl_img').click(function () {
        var selected_class = 'icon_selected_img';
        $('.icon_auswahl_img').removeClass(selected_class);
        $(this).addClass(selected_class);
    });

    if (opt_image_id) {
        $('*[data-image_id="' + opt_image_id + '"]').click();
    } else {
        if (this.tree) {
        // dann die icon_image_id schon mal zu den Icons hinzufügen
            this.add_icon_id(this.tree.icon);
        } else {
        // sonst einfach des erste wählen
            $('.icon_auswahl_img').first().click();
        }
    }
};

TreeForm.prototype.init_upload_icon_button = function () {
    var that = this;

    $('#upload_image_col').hide();
    $('#icon_selector_part').show();


    this.render_icon_list();

    var imageLoader_btn = document.getElementById('icon_upload_btn');
    this.image_uploader.set_caption($('#icon_image_caption'));
    this.image_uploader.set_image_size(80, 80);
    this.image_uploader.set_callback(function (image_id) { that.add_icon_id(image_id); });
    imageLoader_btn.addEventListener('change', this.image_uploader.handleResizeImage.bind(this.image_uploader), false);
};


TreeForm.prototype.init_take_picture_button = function () {
    var imageLoader_btn = document.getElementById('image_upload_btn');
    this.image_uploader.set_caption($('#tree_image_caption'));
    imageLoader_btn.addEventListener('change', this.image_uploader.handleImage.bind(this.image_uploader), false);
};

TreeForm.prototype.init_tabs = function () {
    var self = this;

    $('#tree_form_selector').show();
    $('#tree_form_selector li').click(function () {
        var active_tabselector = $(this).data('tabselector');

        $('.tabselector').removeClass('active');
        $(this).addClass('active');

        $('.form_tab').hide();
        $('div[data-tab="' + active_tabselector + '"]').show();

        if (active_tabselector === 'wetterdaten') {
            if (!self.wiese.data.weather) {
                // Wetterdaten nicht vorhanden
                return;
            }

            var lineChartOptions = {
                animation: {
                    duration: 500,
                    easing: 'inAndOut'
                },
                annotations: {
                    style: 'point',
                    textStyle: {
                        color: '#ffffff'
                    },
                    boxStyle: {
                        stroke: '#18bc9c',
                        strokeWidth: 3,
                        rx: 2,
                        ry: 2,
                        gradient: {
                            color1: '#18bc9c',
                            color2: '#18bc9c',
                            x1: '0%', y1: '0%',
                            x2: '100%', y2: '100%',
                            useObjectBoundingBoxUnits: true
                        }
                    }
                },
                backgroundColor: 'none',
                curveType: 'function',
                hAxis: {
                    title: '',
                    gridlines: {
                        color: '#fff',
                        count: 5
                    },
                    textStyle: {
                        color: '#ccc',
                        fontName: '',
                        fontSize: '11',
                        bold: false,
                        italic: false
                    }
                },
                height: 300,
                interpolateNulls: true,
                legend: {
                    position: 'top',
                    alignment: 'end'
                },
                lineWidth: 1,
                pointSize: 1,
                series: {
                    0: { targetAxisIndex: 0 },
                    1: { targetAxisIndex: 1, lineWidth: 2, pointSize: 5, lineDashStyle: [4, 1] }
                },
                vAxes: {
                    0: { title: '' },
                    1: { title: 'Kronenhöhe' }
                },
                vAxis: {
                    baselineColor: '#ddd',
                    gridlines: {
                        color: '#ddd'
                    },
                    textStyle: {
                        color: '#ccc',
                        fontName: '',
                        fontSize: '11',
                        bold: false,
                        italic: false
                    }
                }
            };

            var rangeFilterOptions = {
                filterColumnIndex: 0,
                ui: {
                    chartOptions: {
                        height: 50,
                        annotations: {
                            highContrast: false,
                            style: 'line',
                            stem: {
                                length: 0
                            },
                            textStyle: {
                                fontSize: 1
                            }
                        }
                    }
                }
            };

            function getDataArray(data, treeData) {
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var date = data[i].date.split('-');
                    var year = date[0];
                    var month = date[1];
                    var day = date[2];

                    date = new Date(year, month, day);

                    var value = data[i].wert;
                    value = parseFloat(value.replace(',', '.'));

                    result[i] = [];
                    result[i][0] = date;
                    result[i][1] = value;
                    result[i][2] = null;
                    result[i][3] = null;
                    result[i][4] = null;

                    if (treeData.pflegezustaende) {
                        $.each(treeData.pflegezustaende, function (timestamp, pflegezustand) {
                            var pflegezustandDate = new Date(parseInt(timestamp, 10));

                            if (pflegezustandDate.getFullYear() === date.getFullYear() && pflegezustandDate.getMonth() === date.getMonth() && pflegezustandDate.getDate() === date.getDate()) {
                                if (pflegezustand.höhe_der_krone && pflegezustand.höhe_der_krone !== '') {
                                    result[i][2] = parseFloat(pflegezustand.höhe_der_krone);
                                }

                                if (pflegezustand.bluete_beginn && pflegezustand.bluete_beginn !== '') {
                                    result[i][3] = 'Blütenbeginn';
                                    result[i][4] = 'Blütenbeginn';
                                } else if (pflegezustand.bluete_end && pflegezustand.bluete_end !== '') {
                                    result[i][3] = 'Blütenende';
                                    result[i][4] = 'Blütenende';
                                }
                            }
                        });
                    }
                }

                return result;
            }

            if (self.wiese.data.weather.temperature && $('#chart_overlay').is(':empty')) {
                var unit = self.wiese.data.weather.temperature[0].einheit;
                var dataArray = getDataArray(self.wiese.data.weather.temperature, self.tree);
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'X');
                data.addColumn('number', unit);
                data.addColumn('number', 'm');
                data.addColumn({ type: 'string', role: 'annotation' }); // annotation role col.
                data.addColumn({ type: 'string', role: 'annotationText' }); // annotationText col.
                data.addRows(dataArray);

                var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
                var duhhh = $.extend(true, {}, rangeFilterOptions, {
                    ui: {
                        chartOptions: {
                            colors: ['#ffb62c']
                        }
                    }
                });
                console.log(duhhh);
                var dateSlider = new google.visualization.ControlWrapper({
                    controlType: 'ChartRangeFilter',
                    containerId: 'slider_overlay',
                    options: duhhh
                });
                var lineChart = new google.visualization.ChartWrapper({
                    chartType: 'LineChart',
                    containerId: 'chart_overlay',
                    options: $.extend(true, {}, lineChartOptions, {
                        title: 'Temperaturverlauf',
                        colors: ['#f39c12', '#802a2a'],
                        vAxes: {
                            0: {
                                title: 'Temperatur'
                            }
                        }
                    })
                });

                dashboard.bind(dateSlider, lineChart);
                dashboard.draw(data);
            }

            if (self.wiese.data.weather.precitipation && $('#chart_overlay_precitipation').is(':empty')) {
                var unit_precitipation = self.wiese.data.weather.precitipation[0].einheit;
                var dataArray_precitipation = getDataArray(self.wiese.data.weather.precitipation, self.tree);
                var data_precitipation = new google.visualization.DataTable();
                data_precitipation.addColumn('date', 'X');
                data_precitipation.addColumn('number', unit_precitipation);
                data_precitipation.addColumn('number', 'm');
                data_precitipation.addColumn({ type: 'string', role: 'annotation' }); // annotation role col.
                data_precitipation.addColumn({ type: 'string', role: 'annotationText' }); // annotationText col.
                data_precitipation.addRows(dataArray_precitipation);

                var dashboard_precitipation = new google.visualization.Dashboard(document.getElementById('dashboard_div_precitipation'));
                var dateSlider_precitipation = new google.visualization.ControlWrapper({
                    controlType: 'ChartRangeFilter',
                    containerId: 'slider_overlay_precitipation',
                    options: $.extend(true, {}, rangeFilterOptions, {
                        ui: {
                            chartOptions: {
                                colors: ['#4eb2f5']
                            }
                        }
                    })
                });
                var lineChart_precitipation = new google.visualization.ChartWrapper({
                    chartType: 'LineChart',
                    containerId: 'chart_overlay_precitipation',
                    options: $.extend(true, {}, lineChartOptions, {
                        title: 'Niederschlagsmenge',
                        colors: ['#3498db', '#802a2a'],
                        vAxes: {
                            0: {
                                title: 'Niederschlag'
                            }
                        }
                    })
                });

                dashboard_precitipation.bind(dateSlider_precitipation, lineChart_precitipation);
                dashboard_precitipation.draw(data_precitipation);
            }
        }
    });
};

TreeForm.prototype.init_get_current_position = function () {
    $('#btnGetCurrentLocation').click(function () {
        var current_text = $(this).text();
        $(this).text('Lädt Position');

        Position.get_current_lon_lat(function (lon, lat) {
            $('#lon').val(lon);
            $('#lat').val(lat);

            $(this).text(current_text);
        }.bind(this));
    });
};

TreeForm.prototype.set_wiese = function (wiese) {
    this.wiese = wiese;
};

TreeForm.prototype.save_form = function () {
    // Das Baum object das aus der MAske erstellt werden kann
    // Dann ist heir gleich klar ob nen extra engelegt wird
    var tree_out_of_form = TreeFormHelper.create_tree_object_from_fields(this.form_rows, this.create_edit_extra);

    if (this.create_edit_extra) {
        tree_out_of_form.extra = this.create_edit_extra;
        tree_out_of_form.icon = this.get_extra_icon_image_id();
    } else {
        tree_out_of_form.pflegezustaende = this.pflegeform.get_pflegezustaende_to_save();
    }

    // check if tree is valid object anhand von erstelltem objekt und der Form
    var validator = new Validator();
    var is_valid = validator.is_valid_object(tree_out_of_form, this.form_rows);

    if (is_valid) {
        if (this.tree) {
        // Tree wird überarbeitet
        // Wird dort auch gespeichert
            this.tree.overwrite_attributes(tree_out_of_form);
            if (!this.create_edit_extra) {
                this.image_uploader.add_uploaded_image(this.tree);
            }

            checkTreeForOrchard(this.tree);

        /*        if(!treeOnOrchard(this.tree.wiese.data.coordinates, this.tree.lon, this.tree.lat)) {
        $('#myModal').modal('show');

        $("#save_anyway").click(function(){
        $('#myModal').modal('hide');
        $('.modal-backdrop').remove();


        this.tree.save();
      }.bind(this));

    }else {
    this.tree.save();
  } */


  //    this.tree.save();
        } else {
            // neuer tree muss erstellt werden
            var tree = tree_out_of_form;
            tree.wiese = this.wiese;
            // in case image was uploaded append it to tree images
            if (!this.create_edit_extra) {
                this.image_uploader.add_uploaded_image(tree);
            }

            checkTreeForOrchard(tree);

  /*                if(!treeOnOrchard(tree.wiese.data.coordinates, tree.lon, tree.lat)) {
  $('#myModal').modal('show');

  $("#save_anyway").click(function(){
  $('#myModal').modal('hide');
  $('.modal-backdrop').remove();


  tree.save();
}.bind(this));

}else {
tree.save();
} */


//    tree.save();
        }
    } else {
  // not valid show warnings
        validator.show_warnings();
    }
};

TreeForm.prototype.init_save_or_cancel = function () {
    $('#cancel_tree_form').click(function () {
        this.wiese.show();
    }.bind(this));


    $('#save_tree_form').click(function () {
    //    $('#myModal').modal('hide');
    //    $('.modal-backdrop').remove();


        this.save_form();
    }.bind(this));
};

function checkTreeForOrchard(tree) {
    if (!treeOnOrchard(tree.wiese.data.coordinates, tree.lon, tree.lat)) {
        $('#myModal').modal('show');

        $('#save_anyway').click(function () {
            $('#myModal').modal('hide');
            $('.modal-backdrop').remove();


            tree.save();
        }.bind(this));
    } else {
        tree.save();
    }
}


TreeForm.prototype.show_qr_code = function () {
  // alles wird im qr code reader gemanegt auch ob der baum noch gar nicht exisitert
  // und deshalb gar kein qr code angezeight werden kann
    var qr_code_helper = new QrCodeHelper()
  .set_obj_and_key_for_text(this.tree, 'key')
  .set_header_field($('#qr_code_header'))
  .set_image_field($('#qr_code_image_field'))
  .set_print_field($('#qr_code_print_box'))

  .render();
};


TreeForm.prototype.init_camera_on_cordova = function () {
    if (new CordovaCamera().is_avaible_on_device()) {
        this.show_latest_tree_image($('#photo_box_camera'));
    // show tab to navigate to camera menu
        $('*[data-tabselector="camera"]').show();

        var camera = new CordovaCamera();
        camera.set_take_picture_btn($('#take_picture_btn'));
        camera.set_photo_box($('#photo_box_camera'));
        camera.set_image_uploader(this.image_uploader);
        camera.init();
    }
};

TreeForm.prototype.init_edit_obstarten = function () {
    $('#edit_obstarten_btn').show();

    $('#edit_obstarten_btn').click(function () {
        NavbarHelper.make_all_unactive();
        NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);
        new ObstEditor(this.wiese.obstarten).show();
    }.bind(this));
};

TreeForm.prototype.show_form = function () {
    $('#HauptFenster').load('./html/tree/form.html', function () {
        this.render_forms();

        this.init_get_current_position();

        this.init_save_or_cancel();

        this.fill_forms_if_tree_already_exists();

        this.show_delete_button_if_tree_already_exists();

        // wurde villeicht von drag gesetzt;
        if (this.lon && this.lat) {
            $('#' + TreeAttr.lon.id).val(this.lon);
            $('#' + TreeAttr.lat.id).val(this.lat);
        }

        if (this.create_edit_extra) {
            this.init_upload_icon_button();
            // wenn man extra ding anlegt

            // pass wiese
            NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);
            // make btn in navbar active
            NavbarHelper.make_active(NavbarHelper.btn.extra_anlegen);
        } else {
            this.init_tabs();

            this.init_take_picture_button();

            this.show_qr_code();

            // if app version show tab to take picture directly from app
            this.init_camera_on_cordova();

            this.init_edit_obstarten();

            // pass wiese
            NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);

            if (!this.tree) {
                // make btn in navbar active if creating new tree
                NavbarHelper.make_active(NavbarHelper.btn.baum_anlegen);
            }
        }
    }.bind(this));
};


TreeForm.prototype.show_latest_tree_image = function (opt_element) {
    if (this.tree && this.tree[TreeAttr.images.id]) {
        var image_keys = Object.keys(this.tree[TreeAttr.images.id]);

        if (image_keys.length > 0) {
            function sortNumber(a, b) { return b - a; }
            // sotiere die keys nach dem erstellungsdatum
            image_keys.sort(sortNumber);

            if (image_keys.length > 0) {
                var image_field = $('#tree_image');
                // falls element vorgegeben ist
                if (opt_element) {
                    opt_element.append('<img src="./img/Baum.jpg" class="img-responsive img-thumbnail" id="tree_image_2">');
                    image_field = $('#tree_image_2');
                }
                var latest_image_id = this.tree[TreeAttr.images.id][image_keys[0]].id;
                ImageHelper.get_image_data_for(latest_image_id, image_field, { save: false });
            }
        }
    }
};

TreeForm.prototype.show_delete_button_if_tree_already_exists = function () {
    if (this.tree) {
        var tree = this.tree;
        $('#tree_form_btn_group').append(
      $('<a/>', { class: 'btn btn-warning', text: 'Löschen',
      click: function () { tree.remove(); }
    })
  );
    }
};

TreeForm.prototype.fill_forms_if_tree_already_exists = function (form_rows) {
    if (this.tree) {
        this.show_latest_tree_image();

        // DAMIT AUCH ANDERE ROWS ANGEZEIGT WERDEN KONNEN
        var rows = null;

        if (form_rows) {
            rows = form_rows;
        } else {
            rows = this.form_rows;
        }

        rows.forEach(function (row) {
      // if(row.func){ MUSS EIG AUCH BAUMSTATUS UPDATEN
      //    row.func(this.tree);
      // }

            if (row.fields) {
                // renders each field
                row.fields.forEach(function (field) {
                    // zwiege nur wenns kein exta type is also Baum oder Special und Form mit dem Field
                    if (this.create_edit_extra == false || (field.extra && field.extra == true)) {
                        if (field.id == TreeAttr.sortname.id || field.id == TreeAttr.obstart.id) {
                            if ($.inArray(this.tree[field.id], $('#' + field.id + ' option').map(function () { return $(this).val(); }).get()) < 0) {
                                // value befindet sich nicht meht in den options
                                console.log(this.tree[field.id]);
                                $('#' + field.id).append($('<option></option>').attr('value', this.tree[field.id]).text(this.tree[field.id]));
                            }
                        }

                        // sets value for each field
                        if (this.tree[field.id]) {
                            $('#' + field.id).val(this.tree[field.id]);
                        }

                        // execute on change of field
                        if (field.onchange) {
                            field.onchange(this.tree[field.id]);
                        }
                    }
                }.bind(this));
            }
        }.bind(this));
    }
};

TreeForm.prototype.render_forms = function (form_rows) {
    // you can pass your own form_rows then its a helper method
    // see wiese/submenu_helper.js
    var rows = null;

    if (form_rows) {
        rows = form_rows;
    } else {
        rows = this.form_rows;
    }

    rows.forEach(function (row) {
        var form_row = $('#' + row.id);

        if (row.func) {
            // if form has attached function, for eg. Pflegeform, execute it
            row.func();
        }

        if (row.fields) {
            // renders each field
            row.fields.forEach(function (field) {
                // zwiege nur wenns kein exta type is also Baum oder Special und Form mit dem Field
                if (this.create_edit_extra == false || (field.extra && field.extra == true)) {
                    var container = $('<div/>', { class: 'form-group' });

                    var style = '';

                    if (field.image) {
                        style = 'width: 100%';
                    }

                    var title = $('<label/>', { class: 'control-label', text: field.title, style: style });

                    if (field.image) {
                        title.append($('<img/>', { src: field.image, class: 'form-image-icon' }));
                    }

                    // calls function form form obj
                    var forms = field.form(field);

                    container.append(title);

                    forms.forEach(function (form) {
                        container.append(form);
                    });

                    form_row.append(container);

                    // function die beim hinzufügen ausgefurt werden soll
                    if (field.on_append) {
                        field.on_append();
                    }
                }
            }.bind(this));
        }
    }.bind(this));
};
