import {useState, useEffect} from 'react'

const getConnection= ()=> {
    return navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection
}

export const useNetwork = ()=> {
    const [connection, updateConnection]= useState(getConnection())
    const [isOnline, setIsOnline]= useState(!!getConnection().rtt)
    useEffect(()=> {
        const updateStatus= ()=> {
            updateConnection(getConnection())
            setIsOnline(!!getConnection().rtt)
        }

        connection.addEventListener('change', updateConnection)
        return ()=> connection.removeEventListener('change', updateConnection)
    }, [connection])

    return [isOnline, connection]
}