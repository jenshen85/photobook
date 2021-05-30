import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { SpriteIconEnum } from '@photobook/data';

@Component({
  selector: 'photobook-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  host: {
    class: 'form-control',
    '[class]': "className ? className : ''",
  },
})
export class FormControlComponent implements AfterViewInit {
  @Input() inputName: string;
  @Input() type = 'text';
  @Input() dataPlaceholder: string;
  @Input() icon: SpriteIconEnum;
  @Input() iconPostfix: boolean;
  @Input() iconPrefix: boolean;
  @Input() label?: string;
  @Output() onChange: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() onInput: EventEmitter<Event> = new EventEmitter<Event>();
  @ViewChild('inputRef') input: ElementRef<HTMLInputElement>;
  private _value: string;

  constructor(private readonly elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this._blurHanddler();
    this.input.nativeElement.addEventListener(
      'focus',
      this._focusHanddler.bind(this)
    );
    this.input.nativeElement.addEventListener(
      'blur',
      this._blurHanddler.bind(this)
    );
  }

  ngOnDestroy(): void {
    this.input.nativeElement.removeEventListener(
      'focus',
      this._focusHanddler.bind(this)
    );
    this.input.nativeElement.removeEventListener(
      'blur',
      this._blurHanddler.bind(this)
    );
  }

  private _focusHanddler() {
    this.elementRef.nativeElement.classList.add('form-control--focused');
  }

  private _blurHanddler() {
    if (!this._value) {
      this.elementRef.nativeElement.classList.remove('form-control--focused');
    }
  }

  @HostBinding('class') get setPrefix() {
    if (this.iconPrefix) {
      return 'iconPrefix';
    } else if (this.iconPostfix) {
      return 'iconPostfix';
    }

    return '';
  }

  onChangeHandler(event: Event): void {
    this._value = (event.target as HTMLInputElement).value;
    this.onChange.emit(event);
  }

  onInputHandler(event: Event): void {
    this._value = (event.target as HTMLInputElement).value;
    this.onInput.emit(event);
  }
}
