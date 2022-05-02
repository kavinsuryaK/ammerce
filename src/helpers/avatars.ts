import { Logger } from '@core/logger'
import { GenerateRandomStringOfLength } from '@core/utils'
class AvatarHelper {
	public getAvatar() {
		Logger.info('Inside Avatar Helper')

		return `https://avatars.dicebear.com/api/identicon/${GenerateRandomStringOfLength(3)}.svg`
	}
}

export default new AvatarHelper()
