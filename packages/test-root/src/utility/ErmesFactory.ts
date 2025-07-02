import { ErmesWebRtcFactory } from "ermes/index";
import { IErmesService } from "iermes/index";



export async function factoryAsync(): Promise<{service_1: IErmesService, service_2: IErmesService}>{
  let factory = new ErmesWebRtcFactory();
  let service_1 = factory.createService({}, {});
  service_1.onError(err => console.error('[Ermes 1] peer error:', err));
  service_1.onClose(() => console.log('[Ermes 1] peer closed'));
  service_1.onConnect(() => console.log('[Ermes 1] peer connected'));

  let offer = await service_1.createSignal();

  let service_2 = factory.createService({}, {offer});
  service_1.onError(err => console.error('[Ermes 2] peer error:', err));
  service_1.onClose(() => console.log('[Ermes 2] peer closed'));
  service_1.onConnect(() => console.log('[Ermes 2] peer connected'));

  let answer = await service_2.createSignal();
  service_1 = factory.connectService(service_1, answer);

  try {
    await service_1.waitForConnect();
    await service_2.waitForConnect();
    console.log('✅ WebRTC DataChannel is open—safe to send!');
  } catch (err) {
    console.error('❌ Failed to connect:', err);
  }
  
  return {service_1, service_2}

    
}

