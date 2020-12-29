import { getCertificate } from '../index';

getCertificate({ commonName: 'example.com'}).catch(console.error);
