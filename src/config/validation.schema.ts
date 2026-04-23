import * as Joi from 'joi';

export const validationSchema: Joi.ObjectSchema<EnvConfigData> = Joi.object({
  FB_PROJECT_ID: Joi.string().required(),
  FB_PRIVATE_KEY: Joi.string().required(),
  FB_CLIENT_EMAIL: Joi.string().required(),
  DELAY_NEW_NOTIFICATION: Joi.number().required(),
});
