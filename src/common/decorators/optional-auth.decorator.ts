import { SetMetadata } from '@nestjs/common';
import { OPTIONAL_AUTH_KEY } from '../constants';

export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);
