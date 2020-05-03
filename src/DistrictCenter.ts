
import { District, DistrictLevel } from './District'
import { Builder } from './source2/Builder'
import * as assert from 'assert'

// 使用时才实例化
let builder: Builder

/**
 * 处理中国行政区域相关的问题
 * - 省市县三级结构，严格分层
 * - 存在没有市的县
 */
export class DistrictCenter {
    static chinaAdcode = '100000'

    private _adcodeToRecord: Map<string, District>

    get country(): District {
        return this._adcodeToRecord.get(DistrictCenter.chinaAdcode) as District
    }

    constructor() {
        builder || (builder = new Builder())
        this._adcodeToRecord = builder.adcodeToRecord
    }

    getProvinces() { return [...this._adcodeToRecord.values()].filter(d => d.level == 'province') }
    getCities() { return [...this._adcodeToRecord.values()].filter(d => d.level == 'city') }
    getCounties() { return [...this._adcodeToRecord.values()].filter(d => d.level == 'county') }

    forEach(fn: (record: District) => void) {
        for (let record of this._adcodeToRecord.values()) {
            fn(record)
        }
    }

    getByAdcode(adcode: string): District | undefined {
        return this._adcodeToRecord.get(adcode)
    }

    getParent(adcode: string): District | undefined {
        let d = this._adcodeToRecord.get(adcode)
        if (!d) {
            assert(false, `${adcode} not exist`)
            return
        }
        return d.parent
    }


    getOwnerProvince(adcode: string): District | undefined {
        return this.getOwner(adcode, 'province')
    }

    getOwnerCity(adcode: string): District | undefined {
        return this.getOwner(adcode, 'city')
    }

    getOwnerCounty(adcode: string): District | undefined {
        return this.getOwner(adcode, 'county')
    }

    getOwner(adcode: string, level: DistrictLevel): District | undefined {
        let record = this._adcodeToRecord.get(adcode)
        if (!record) { return undefined }

        if (record.level == level) {
            return record
        }

        if (!record.parent) { return undefined }

        return this.getOwner(record.parent.adcode, level)
    }

    // 获取所有的叶子行政单位，没有下级架构
    getLeafs(): District[] {
        return [...this._adcodeToRecord.values()].filter(d => d.childrenCount === 0)
    }
}
