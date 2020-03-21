import { SetMetadata } from '@nestjs/common';

export const Secured = (...authorites: string[]) => SetMetadata( 'authorities', authorites);
