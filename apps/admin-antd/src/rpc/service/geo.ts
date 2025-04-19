import type { CreateSysApiRequest, SysApi } from "../api/entpb/entpb.pb";
import { requestClient } from "#/rpc/request";


export class GeoServiceImpl {
  async CenterMap(): Promise<SysApi> {
    return await requestClient.get<SysApi>('/map-geojson/chain.json');
  }
  async GeoBase(): Promise<SysApi> {
    throw new Error("Method not implemented.");
  }

}

export const defGeoService = new GeoServiceImpl();
