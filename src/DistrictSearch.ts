import { DistrictCenter } from './DistrictCenter'
import { District, DistrictLevel } from './District'
import * as assert from 'assert'

export class DistrictSearch {
    private _nameToRecord: Map<string, District[]> = new Map

    constructor(private _districtCenter: DistrictCenter) {
        this._districtCenter.forEach(district => {
            if (!this._nameToRecord.has(district.name)) {
                this._nameToRecord.set(district.name, [district])
            } else {
                let ary = this._nameToRecord.get(district.name)
                ary.push(district)
            }
        })
    }

    findByName(name: string, level: DistrictLevel): District[] {
        let records = this._nameToRecord.get(name)
        if (!records) { return [] }
        records = records.filter(record => record.level == level)
        return records
    }

    findOneByName(name: string, level: DistrictLevel): District {
        let records = this._nameToRecord.get(name)
        assert.equal(records.length, 1, `${name} exist multiply names`)

        let one = records[0]
        assert.equal(one.level, level)
        return one
    }
}
