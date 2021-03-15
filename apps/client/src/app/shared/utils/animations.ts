import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { fadeIn, fadeOut } from 'ng-animate';

export const fadeAnimations: {
  readonly fade: AnimationTriggerMetadata;
  readonly fadeIn: (timing?: number) => AnimationTriggerMetadata;
  readonly fadeOut: (timing?: number) => AnimationTriggerMetadata;
} = {
  fade: trigger('fade', [
    state('void, exit', style({ opacity: 0 })),
    transition(
      '* => enter',
      animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1 }))
    ),
    transition(
      '* => void, * => exit',
      animate('75ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0 }))
    ),
  ]),
  fadeIn: (timing: number = 0.3) =>
    trigger('fadeIn', [
      transition('void => *', useAnimation(fadeIn, { params: { timing } })),
    ]),
  fadeOut: (timing: number = 0.3) =>
    trigger('fadeOut', [
      transition('* => void', useAnimation(fadeOut, { params: { timing } })),
    ]),
};
