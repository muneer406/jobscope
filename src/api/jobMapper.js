const DEFAULT_COMPANY_NAME = 'Unknown Company';
const DEFAULT_LOCATION = 'Remote';
const TAG_LIMIT = 3;

function formatText(value) {
    return String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();
}

function capitalizeSentence(value) {
    const normalizedValue = formatText(value);

    if (!normalizedValue) {
        return '';
    }

    return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
}

function createTagsFromTitle(title) {
    const words = formatText(title)
        .toLowerCase()
        .split(' ')
        .map(word => word.replace(/[^a-z0-9]/g, ''))
        .filter(word => word.length > 3);

    const uniqueWords = Array.from(new Set(words));

    return uniqueWords.slice(0, TAG_LIMIT);
}

export function mapUsersById(users) {
    return users.reduce((userMap, user) => {
        userMap[user.id] = user;
        return userMap;
    }, {});
}

export function mapPostToJob(post, user = {}) {
    return {
        id: post.id,
        title: capitalizeSentence(post.title),
        description: formatText(post.body),
        company: formatText(user.company?.name) || formatText(user.name) || DEFAULT_COMPANY_NAME,
        location: formatText(user.address?.city) || DEFAULT_LOCATION,
        tags: createTagsFromTitle(post.title),
    };
}

export function mapPostsToJobs(posts, users) {
    const usersById = mapUsersById(users);

    return posts.map(post => mapPostToJob(post, usersById[post.userId]));
}