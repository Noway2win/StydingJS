const postData = async (url, data) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    return await res.json();
};
const getResource = async (url) => {
    const data = await fetch(url);
    if (!data.ok) {
        throw new Error(`Can not get data from${url}, message status ${data.status}`);
    }
    return await data.json();
};

export {
    postData
};
export {
    getResource
};