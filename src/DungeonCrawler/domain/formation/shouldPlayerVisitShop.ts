export const shouldPlayerVisitShop = (roomsClearedCount: number): boolean => {
    if (roomsClearedCount <= 9) {
        return roomsClearedCount % 3 === 0;
    }

    if (roomsClearedCount <= 20) {
        return roomsClearedCount % 4 === 0;
    }

    return roomsClearedCount % 5 === 0;
};
