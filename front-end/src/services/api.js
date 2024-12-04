import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    config => {
        console.log('Request:', config)
        return config
    },
    error => {
        console.error('Request Error:', error)
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        console.log('Response:', response)
        return response.data
    },
    error => {
        console.error('Response Error:', error)
        if (error.response?.data) {
            console.error('Error Data:', error.response.data)
            console.error('Error Status:', error.response.status)
        }
        return Promise.reject(error)
    }
)

export const studentService = {
    getAll: () => api.get('/estudiantes'),
    create: (data) => api.post('/estudiante', data),
    update: (matricula, data) => api.put(`/estudiante/${matricula}`, data),
    delete: (matricula) => api.delete(`/estudiante/${matricula}`),
    getByMatricula: (matricula) => api.get(`/estudiante/${matricula}`),
}

export const profesorService = {
    getAll: () => api.get('/profesores'),
    create: (data) => api.post('/profesor', data),
    update: (noempleado, data) => api.put(`/profesor/${noempleado}`, data),
    delete: (noempleado) => api.delete(`/profesor/${noempleado}`),
    getByNoEmpleado: (noempleado) => api.get(`/profesor/${noempleado}`),
}

export const cursosService = {
    getAll: () => api.get('/cursos'),
    create: (data) => api.post('/curso', data),
    update: (clave, data) => api.put(`/curso/${clave}`, data),
    delete: (clave) => api.delete(`/curso/${clave}`),
    getByNoEmpleado: (clave) => api.get(`/curso/${clave}`),
}

export default api