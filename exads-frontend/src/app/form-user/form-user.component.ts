import {Component, Inject, OnChanges, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ThemePalette} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'exads-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit, OnChanges {
  originalFormValues: any;
  isFormDirty = false;
  color: ThemePalette = 'primary';


  statusText: string;

  editForm: UntypedFormGroup;

  constructor(
    private dialogRef: MatDialogRef<FormUserComponent>,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
    this.setOriginalFormValues();
    this.updateStatusText();
  }

  ngOnInit() {
    // Desativar o foco automático no primeiro campo
    this.editForm.controls['first_name'].markAsPristine();
  }

  ngOnChanges() {
    this.setOriginalFormValues();
  }

  toggleStatus() {
    this.editForm.get('id_status').setValue(this.editForm.get('id_status').value === 1 ? 0 : 1);
    this.updateStatusText();
  }

  updateStatusText() {
    this.statusText = this.editForm.get('id_status').value === 1 ? 'Active' : 'Disabled';
  }
  createForm() {
    this.editForm = this.formBuilder.group({
      id: [this.data.id, Validators.required],
      first_name: [this.data.first_name, Validators.required],
      last_name: [this.data.last_name],
      email: [this.data.email, Validators.required],
      username: [this.data.username, Validators.required],
      created_date: [this.data.created_date],
      id_status: [this.data.id_status, Validators.required],
    });

    this.editForm.valueChanges.subscribe(() => {
      this.isFormDirty = this.isFormValueChanged();
    });
  }

  setOriginalFormValues() {
    this.originalFormValues = { ...this.editForm.value };
  }

  isFormValueChanged(): boolean {
    const currentFormValues = this.editForm.value;
    return Object.keys(currentFormValues).some(key => currentFormValues[key] !== this.originalFormValues[key]);
  }

  saveChanges() {
    this.dialogRef.close(this.editForm.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
