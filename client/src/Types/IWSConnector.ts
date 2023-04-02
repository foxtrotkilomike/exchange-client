import { ClientEnvelope } from '../Models/ClientMessages';

interface IWSConnector {
  connect: () => void;
  disconnect: () => void;
  send: (message: ClientEnvelope) => void;
}

export default IWSConnector;
