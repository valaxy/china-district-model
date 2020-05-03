import { DistrictCenter } from './DistrictCenter'
import { District } from './District'

declare class AliasDistrict extends District {
    extraNames: string[] // 不常用的其他名称
}


/**
 * 对部分区域设定别名，并使用组合名称
 */
export class AliasDistrictSearch {
    private _aliasToDistrict: Map<string, AliasDistrict[]> = new Map

    get districtCenter() {
        return this._districtCenter
    }

    constructor(private _districtCenter: DistrictCenter, opts: {
        alias: { [name: string]: string[] }
    }) {
        this._bindExtraNames(opts.alias)
        this._addAliasDistrict()
    }

    private _bindExtraNames(alias: { [name: string]: string[] }) {
        this._districtCenter.forEach((record: AliasDistrict) => {
            record.extraNames = alias[record.name] ? alias[record.name] : []
        })
    }

    private _getCombinations(district: AliasDistrict) {
        if (!district.parent) {
            return [''].concat(district.name, district.extraNames) // 注意包含空名称哦
        }

        let names = []
        for (let p of this._getCombinations(district.parent as AliasDistrict)) {
            for (let c of [''].concat(district.name, district.extraNames)) { // 注意包含空名称哦
                names.push(`${p}${c}`)
            }
        }

        return names
    }

    // A B C => C, BC, ABC, AC
    private _getAllFullNames(district: AliasDistrict) {
        if (!district.parent) {
            return [].concat(district.name, district.extraNames)
        }

        let names = []
        for (let p of this._getCombinations(district.parent as AliasDistrict)) {
            for (let c of [].concat(district.name, district.extraNames)) {
                names.push(`${p}${c}`)
            }
        }

        return names
    }

    private _addAliasDistrict() {
        this._districtCenter.forEach((record: AliasDistrict) => {
            let names = this._getAllFullNames(record)
            for (let name of names) {
                let ary = this._aliasToDistrict.get(name)
                if (ary) {
                    ary.push(record)
                } else {
                    this._aliasToDistrict.set(name, [record])
                }
            }
        })
    }

    getByAlias(alias: string): District[] {
        if (this._aliasToDistrict.has(alias)) {
            return this._aliasToDistrict.get(alias)
        }
        return []
    }

    getAllAlias() {
        return [...this._aliasToDistrict.keys()]
    }
}




