import { VrtnuBeApi } from '@/vrtnu-be/VrtnuBeApi';
import { ScrobbleParser } from '@common/ScrobbleParser';
import { Item } from '@models/Item';

class _VrtnuBeParser extends ScrobbleParser {
	constructor() {
		super(VrtnuBeApi, {
			watchingUrlRegex: /\/a-z\/.+?\/.+?\/(?<id>.+?)\//, // https://www.vrt.be/vrtnu/a-z/dertigers/3/dertigers-s3a1/
		});
	}

	parseItemFromDom() {
		const serviceId = this.api.id;
		let showTitle: string | null = null;
		let seasonOrYear: string | null = null;
		let seasonAndEpisode: string | undefined = undefined;
		let id: string | undefined = undefined;
		let seasonStr: string | undefined = undefined;
		let episodeStr: string | undefined = undefined;

		// https://www.vrt.be/vrtnu/a-z/dertigers/3/dertigers-s3a1/
		// https://www.vrt.be/vrtnu/a-z/une-soeur/2018/une-soeur/
		const matches =
			/\/a-z\/(?<showTitle>.+?)\/(?<seasonOrYear>.+?)\/(?<id>(?:.+?)(?<seasonAndEpisode>-s(?<seasonStr>\d+)a(?<episodeStr>\d+))?)\//.exec(
				this.getLocation()
			);

		if (matches?.groups) {
			({ showTitle, seasonOrYear, id, seasonAndEpisode, seasonStr, episodeStr } = matches.groups);
		}

		const title = showTitle?.split('-').join(' ') ?? '';
		const episodeTitle = '';
		const season = seasonAndEpisode ? parseInt(seasonStr ?? '') : undefined;
		const episode = seasonAndEpisode ? parseInt(episodeStr ?? '') : undefined;
		const type = seasonAndEpisode ? 'show' : 'movie';
		const year = !seasonAndEpisode ? parseInt(seasonOrYear ?? '') : 0;

		if (!id) {
			return null;
		}

		return new Item({
			serviceId,
			id,
			type,
			title,
			year,
			episodeTitle,
			season,
			episode,
		});
	}
}

export const VrtnuBeParser = new _VrtnuBeParser();
