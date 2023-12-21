import {Component, Inject, OnChanges, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ThemePalette} from "@angular/material/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../models/user.model";
import {ApiService} from "../services/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'exads-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit, OnChanges {
  originalFormValues: any;
  isFormDirty = false;
  update = true;
  color: ThemePalette = 'primary';

  usernameValidator = [];
  statusText: string;

  editForm: UntypedFormGroup;
  isUsernameAvailable = true;


  constructor(
    private dialogRef: MatDialogRef<FormUserComponent>,
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.id === -1) {
      this.usernameValidator = [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[^{}"\[\].!]+$/),

      ]
      this.update = false
    }
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
    this.statusText = this.editForm.get('id_status').value === 1 ? 'active' : 'disabled';
  }

  createForm() {
    this.editForm = this.formBuilder.group({
      id: [this.data.id, Validators.required],
      first_name: [this.data.first_name, Validators.required],
      last_name: [this.data.last_name],
      email: [
        this.data.email,
        [
          Validators.required,
          Validators.email, // Validator padrão para e-mail
          this.customEmailValidator // Adiciona a validação personalizada
        ]
      ],
      username: [
        this.data.username,
        this.usernameValidator,
        this.update ? null : this.usernameAsyncValidator.bind(this)
      ],
      created_date: [this.data.created_date],
      id_status: [this.data.id_status, Validators.required],
    });

    this.editForm.valueChanges.subscribe(() => {
      this.isFormDirty = this.isFormValueChanged();
    });
  }

  private usernameAsyncValidator(control: AbstractControl): Promise<{ [key: string]: boolean } | null> {
    const username = control.value;

    return new Promise(async (resolve) => {
      try {
        const response = await this.apiService.checkUsernameAvailability(username).toPromise();

        if (response.data.count === 0) {
          this.isUsernameAvailable = true;
          resolve(null);
        } else {
          // Use o TranslateService para obter a tradução da mensagem
          this.translateService.get('app.editUserModal.usernameAlreadyTaken').subscribe((translation: string) => {
            // Exiba uma mensagem de toast informando que o nome de usuário já está ocupado
            this.snackBar.open(translation, this.translateService.instant('app.editUserModal.close'), {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          });
          this.isUsernameAvailable = false;
          resolve({'usernameTaken': true});
        }
      } catch (error) {
        resolve({'usernameCheckFailed': true});
      }
    });
  }

  private customEmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);

    return valid ? null : {'invalidEmail': true};
  }


  private mapFormToUser(formValue: any): User {
    return new User(
      formValue.id,
      formValue.first_name,
      formValue.last_name,
      formValue.email,
      formValue.username,
      formValue.created_date,
      formValue.id_status
    );
  }

  setOriginalFormValues() {
    this.originalFormValues = {...this.editForm.value};
  }

  isFormValueChanged(): boolean {
    const currentFormValues = this.editForm.value;
    return Object.keys(currentFormValues).some(key => currentFormValues[key] !== this.originalFormValues[key]);
  }

  saveChanges() {
    this.dialogRef.close(this.mapFormToUser(this.editForm.value));
  }

  cancel() {
    this.dialogRef.close();
  }
}
