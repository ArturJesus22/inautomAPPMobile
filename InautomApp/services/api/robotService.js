// services/api/robotService.js
import client from './client';

// Dados mockados para fallback
const getMockRobots = () => {
    return [
        {
            ID: 1,
            Modelo: 'RobotTT',
            SN: 'RX-1234567',
            Estado: 2, // AUTO
            IN_Error: 0,
            PRG_Run: 1,
            IP: '192.168.1.101',
            Contador_Ciclos_Geral: 1250,
            Ultima_Atualizacao: '2025-03-11 13:04:07',
            Empresa_ID: 3
        },
        {
            ID: 2,
            Modelo: 'RobotArtur',
            SN: 'NEO-1234567',
            Estado: 0, // PARADO
            IN_Error: 1,
            PRG_Run: 0,
            IP: '192.168.1.102',
            Contador_Ciclos_Geral: 26074,
            Ultima_Atualizacao: '2025-03-10 17:55:07',
            Empresa_ID: 3
        }
    ];
};

// Função para obter a lista de robôs
export const getRobots = async () => {
    try {
        // Tentar endpoint com parâmetro de ordenação explícito para evitar o erro
        console.log('🤖 Tentando obter lista de robôs...');
        const response = await client.get('/api/robot?sort=-ID'); // Ordenar por ID decrescente
        console.log('✅ Robôs recebidos:', response.data);

        if (response.data) {
            return response.data;
        }
    } catch (error) {
        console.error('❌ Erro ao obter robôs:', error.message);

        // Se falhar, use dados mockados
        console.warn('⚠️ Usando dados mockados como fallback');
        return getMockRobots();
    }

    // Se a resposta for vazia
    console.warn('⚠️ Resposta vazia. Usando dados mockados.');
    return getMockRobots();
};

// O resto do código permanece o mesmo...


// Função para obter estatísticas dos robôs
export const getRobotStats = async () => {
    try {
        console.log('📊 A obter estatísticas dos robôs...');
        const response = await client.get('/api/robot/estatisticas');
        console.log('✅ Estatísticas recebidas:', response.data);

        if (response.data) {
            return response.data;
        } else {
            throw new Error('Erro ao obter estatísticas dos robôs');
        }
    } catch (error) {
        console.error('❌ Erro no getRobotStats:', error.message);
        if (error.response) {
            console.error('📄 Detalhes da resposta:', {
                status: error.response.status,
                data: error.response.data
            });
        }

        // Retornar estatísticas mockadas como fallback
        return {
            total: 2,
            em_erro: 1,
            em_ciclo: 1,
            manutencao_pendente: 0,
            status_distribution: {
                parado: 1,
                manual: 0,
                auto: 1
            }
        };
    }
};

// Função para obter detalhes de um robô específico
export const getRobotDetails = async (robotId) => {
    try {
        console.log(`🔍 Obter detalhes do robô ID ${robotId}...`);
        const response = await client.get(`/api/robot/detalhe?id=${robotId}`);
        console.log('✅ Detalhes do robô recebidos:', response.data);

        if (response.data) {
            return response.data;
        } else {
            throw new Error('Erro ao obter detalhes do robô');
        }
    } catch (error) {
        console.error('❌ Erro no getRobotDetails:', error.message);
        if (error.response) {
            console.error('📄 Detalhes da resposta:', {
                status: error.response.status,
                data: error.response.data
            });
        }

        // Retornar dados mockados do robô específico
        const mockRobots = getMockRobots();
        const robot = mockRobots.find(r => r.ID.toString() === robotId.toString());

        if (robot) {
            return robot;
        } else {
            throw new Error('Robô não encontrado');
        }
    }
};
