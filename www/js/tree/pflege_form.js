/* globals PflegeAttr, Form, PflegeFormHelper */

var PflegeForm = function (tree) {
    this.tree = tree;
    // Kann nur immer ein neuer Pflegezustand erstellt werden
    // Bei jeder bearbetung
    this.new_pflegezustand = null;

    // when a user clicks around and edits several pflegezustände
    if (this.tree && this.tree.pflegezustaende) {
        // if already has zustaende, save them them to temp and save them maybe later
        this.tmp_pflegezustaende = this.tree.pflegezustaende;
    } else {
        // for a tree that does not exist or that has no pflege leave blank
        this.tmp_pflegezustaende = {};
    }


    this.form_rows = [
        {    // Is there to keep track which zustand is edited right now
            id: 'hidden_pflege_row',
            fields: [
                { id: PflegeAttr.id.id,
                    form: Form.Text
                }
            ]
        },
        {
            id: 'pflege_row_1_1',
            fields: [
                { id: PflegeAttr.krone_beschnitten.id,
                    form: Form.Checkbox,
                    title: PflegeAttr.krone_beschnitten.title
                }
            ]
        },
        {
            id: 'pflege_row_1_2',
            fields: [
                { id: PflegeAttr.hohe_der_krone.id,
                    form: Form.Text,
                    title: PflegeAttr.hohe_der_krone.title
                }
            ]
        },
        {
            id: 'pflege_row_2_1',
            fields: [
                { id: PflegeAttr.baumstamm_gereinigt.id,
                    form: Form.Checkbox,
                    title: PflegeAttr.baumstamm_gereinigt.title
                }
            ]
        },
        {
            id: 'pflege_row_2_2',
            fields: [
                { id: PflegeAttr.baumstamm_gekalket.id,
                    form: Form.Checkbox,
                    title: PflegeAttr.baumstamm_gekalket.title
                }
            ]
        },
        {
            id: 'pflege_row_3',
            fields: [
                { id: PflegeAttr.schaedline.id,
                    form: Form.Textarea,
                    rows: 2,
                    title: PflegeAttr.schaedline.title
                }
            ]
        },
        {
            id: 'pflege_row_4',
            fields: [
                { id: PflegeAttr.verbiss_spuren.id,
                    form: Form.Textarea,
                    rows: 2,
                    title: PflegeAttr.verbiss_spuren.title
                }
            ]
        },
        {
            id: 'pflege_row_5',
            fields: [
                { id: PflegeAttr.bluete_beginn.id,
                    form: Form.Checkbox,
                    title: PflegeAttr.bluete_beginn.title
                },
                { id: PflegeAttr.bluete_end.id,
                    form: Form.Checkbox,
                    title: PflegeAttr.bluete_end.title
                }
            ]
        },
        {
            id: 'pflege_row_6',
            fields: [
                {
                    id: PflegeAttr.bluehintensitaet.id,
                    form: Form.Range,
                    min: 0,
                    max: 6,
                    range_name: 'Blühintensität',
                    title: PflegeAttr.bluehintensitaet.title
                },
                {
                    id: PflegeAttr.ertragsintensitaet.id,
                    form: Form.Range,
                    min: 0,
                    max: 6,
                    range_name: 'Ertragsintensität',
                    title: PflegeAttr.ertragsintensitaet.title
                }
            ]
        }
    ];
};


PflegeForm.prototype.init_pflegezustände = function () {
    var pflegezustände_box = $('#pflegezustände_list');
        // clear box
    pflegezustände_box.html('');

    if (this.tree && this.tree.pflegezustaende) {
        var ele = $('<div/>', { class: 'list-group' });
        // render zustände in side menü
        var pflege_keys = Object.keys(this.tree.pflegezustaende);

        function sortNumber(a, b) { return b - a; }
        // sotiere die keys nach dem erstellungsdatum
        pflege_keys.sort(sortNumber);

        pflege_keys.forEach(function (key) {
            var pflegezustand = this.tree.pflegezustaende[key];

            var list_group_item = $('<a/>', { class: 'list-group-item', href: '#', 'data-id': key }).append(
                            $('<h4/>', { text: PflegeFormHelper.transform_id_to_name(key) })
                        // ).append(
                        // $('<p/>', { class: 'list-group-item-text', text: 'Florian' })
                        );

            $(list_group_item).click(function () {
                // on click edit zusand
                this.edit_pflegezustand(key);
            }.bind(this));

            ele.append(list_group_item);
        }.bind(this));

        pflegezustände_box.html(ele);
    } else {
        var box = $('<div/>', { class: 'well', text: 'Sie haben noch keine Angaben zum Pflegezustandes des Baumes gemacht.' });

        pflegezustände_box.html(box);
    }
};


PflegeForm.prototype.delete_pflegezustand = function (key) {
    // delete only from tmp pflegezustände
    delete this.tmp_pflegezustaende[parseInt(key, 10)];
};

PflegeForm.prototype.edit_pflegezustand = function (key) {
    // save current changes to tmp
    this.save_current_changes_to_tmp_pflegezustaende();

    var pflegezustände_box = $('#pflegezustände_list');
    pflegezustände_box.find('.list-group-item').removeClass('active');

    var remove_pflegezustand_btn = $('#remove_pflegezustand_btn');
        // verstecke button und enfterne funktionalität zu löschen
    remove_pflegezustand_btn.hide();
    remove_pflegezustand_btn.unbind('click');

    $('#create_new_pflege_btn').remove();

    // means if the pflgezustand already exists
    if (key) {
        // change überschrift of form
        $('#pflege_form_header').text('Pflegezustand vom ' + PflegeFormHelper.transform_id_to_name(key));

        // show fields in form
        this.fill_forms_with_pflegezustand(this.tree.pflegezustaende[key]);

        // set id field to key so that its clear which zustand is edited
        $('#' + PflegeAttr.id.id).val(key);

        // zeige button
        // entferne wenn nötig pflegezustand
        remove_pflegezustand_btn.show();
        remove_pflegezustand_btn.click(function () {
            // remove_element from list
            pflegezustände_box.find('[data-id=' + key + ']').remove();

            // call same method but without key, means new pflege
            this.edit_pflegezustand(null);

            // gets only deleted, from tmp, is deleted on save
            this.delete_pflegezustand(key);
        }.bind(this));

        // active
        // make element in list active
        pflegezustände_box.find('[data-id=' + key + ']').addClass('active');

        // if user wants to continue creating new zustand
        var create_new_zustand_button = $('<a/>', { id: 'create_new_pflege_btn', class: 'list-group-item', href: '#', style: 'margin-top:20px' }).append(
                                            $('<h4/>', { class: 'list-group-item-heading', text: 'Neuen Pflegezustand anlegen' })
                                         );


        // wenn new button is clicked,
        create_new_zustand_button.click(function () {
            // call same method but without key, means new pflege
            this.edit_pflegezustand(null);
        }.bind(this));

        pflegezustände_box.append(create_new_zustand_button);
    } else {
        // means new pflegezustand
        // change überschrift of form
        $('#pflege_form_header').text('Neuer Pflegezustand');
        // clear forms
        this.fill_forms_with_pflegezustand(this.new_pflegezustand);
        // set id to null so that its clear zustand does not exist
        $('#' + PflegeAttr.id.id).val('');
    }
};


PflegeForm.prototype.render = function (box) {
    this.box = box;

    $(box).load('./html/tree/pflege_form.html', function () {
        this.init_pflegezustände();
        this.render_forms();
    }.bind(this));
};


PflegeForm.prototype.fill_forms_with_pflegezustand = function (pflegezustand) {
    this.form_rows.forEach(function (row) {
        if (row.fields) {
            // renders each field
            row.fields.forEach(function (field) {
                // sets value for each field
                if (pflegezustand && pflegezustand[field.id]) {
                    var form = $('#' + field.id);

                    if (field.form == Form.Checkbox) {
                        form.prop('checked', pflegezustand[field.id]);
                    } else {
                        form.val(pflegezustand[field.id]);
                    }
                } else {
                    $('#' + field.id).val('');
                }
            }.bind(this));
        }
    }.bind(this));
};


PflegeForm.prototype.render_forms = function () {
    this.form_rows.forEach(function (row) {
        var form_row = $('#' + row.id);

        if (row.func) {
            row.func(this.tree);
        }

        if (row.fields) {
            // renders each field
            row.fields.forEach(function (field) {
                var container = $('<div/>', { class: 'form-group' });


                            // calls function form form obj
                var form = field.form(field);

                if (field.form != Form.Checkbox) {
                    var title = $('<label/>', { class: 'control-label', text: field.title });
                    container.append(title);
                }

                container.append(form);

                form_row.append(container);
            });
        }
    }.bind(this));
};

PflegeForm.prototype.save_current_changes_to_tmp_pflegezustaende = function () {
    var zustand_obj = {};

    this.form_rows.forEach(function (row) {
        if (row.fields) {
            row.fields.forEach(function (field) {
                // get the value of the field
                var val = Form.get_value_for(field);
                // add it to the tree object
                zustand_obj[field.id] = val;
            });
        }
    });

    // check if current entry alread has assigend a creation time
    var zustand_key = $('#' + PflegeAttr.id.id).val();

    if (zustand_key != '') {
        // overrite existing
        this.tmp_pflegezustaende[zustand_key] = zustand_obj;
    } else {
        // check that its not completly empty
        var only_blank = true;
        Object.keys(zustand_obj).forEach(function (key) {
            if (!(zustand_obj[key] == '' || zustand_obj[key] == null)) {
                only_blank = false;
            }
        });

        if (only_blank == false) {
            this.new_pflegezustand = zustand_obj;
        }
    }
};

PflegeForm.prototype.get_pflegezustaende_to_save = function () {
    // damit keine änderungen verloren gehen
    this.save_current_changes_to_tmp_pflegezustaende();

    // now also append the new pflegeszustand to existing ones
    if (this.new_pflegezustand) {
        // key is DateTime as a Integer
        this.tmp_pflegezustaende[Date.now()] = this.new_pflegezustand;
    }

    return this.tmp_pflegezustaende;
};
